import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'

export const Tasks = new Mongo.Collection('tasks')

// This code only runs on the server
if (Meteor.isServer) {
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [{ private: { $ne: true } }, { owner: this.userId }]
    })
  })
}

// Controllers
const insertTask = async function ({ text, groupName }) {
  check(text, String)
  check(groupName, String)

  if (!this.userId) throw new Meteor.Error('not-authorized')

  // console.log('{text, groupName}', text, groupName)
  let { _id: groupId } = await Meteor.call('groups.findByName', groupName)

  if (!groupId) {
    groupId = await Meteor.call('groups.insert', groupName)
  }

  console.log('I WANT ONE', groupId)
  // return
  // Make sure the user is logged in before inserting a task
  // if (!text.trim()) throw new Error('Todo needs content')
  Tasks.insert({
    text,
    groupId: groupId,
    createdAt: new Date(),
    owner: this.userId,
    username: Meteor.users.findOne(this.userId).username
  })
}

const removeTask = function (taskId) {
  check(taskId, String)

  const task = Tasks.findOne(taskId)
  if (task.private && task.owner !== this.userId) {
    // If the task is private, make sure only the owner can delete it
    throw new Meteor.Error('not-authorized')
  }
  Tasks.remove(taskId)
}

const setChecked = function (taskId, setChecked) {
  check(taskId, String)
  check(setChecked, Boolean)

  const task = Tasks.findOne(taskId)
  if (task.private && task.owner !== this.userId) {
    // If the task is private, make sure only the owner can check it off
    throw new Meteor.Error('not-authorized')
  }
  Tasks.update(taskId, { $set: { checked: setChecked } })
}

const setPrivate = function (taskId, setToPrivate) {
  check(taskId, String)
  check(setToPrivate, Boolean)

  const task = Tasks.findOne(taskId)

  // Make sure only the task owner can make a task private
  if (task.owner !== this.userId) {
    throw new Meteor.Error('not-authorized')
  }

  Tasks.update(taskId, {
    $set: { private: setToPrivate }
  })
}

// Its like writing middlewares that overrides the default methods and/or adds new methods on mongo collection Tasks
Meteor.methods({
  'tasks.insert': insertTask,
  'tasks.remove': removeTask,
  'tasks.setChecked': setChecked,
  'tasks.setPrivate': setPrivate
})
