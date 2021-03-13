import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'

export const Groups = new Mongo.Collection('groups')

// This code only runs on the server
if (Meteor.isServer) {
  // Only publish all groups
  Meteor.publish('groups', function groupsPublication() {
    return Groups.find({})
  })
}

// Controllers
const insertGroup = async function (groupName) {
  check(groupName, String)

  if (!this.userId) throw new Meteor.Error('not-authorized')

  const existing = await findGroupByName(groupName)
  if (existing._id) throw new Meteor.Error('duplicate-entry-group')

  const groupId = await Groups.insert({
    name: groupName,
    createdAt: new Date()
    // owner: this.userId,
    // username: Meteor.users.findOne(this.userId).username
  })

  return groupId
}

const findGroupByName = async function (groupName) {
  const cursor = Groups.find({
    name: { $eq: groupName }
  })
  const allValues = []
  await cursor.forEach((doc) => allValues.push(doc))
  return allValues[0] ? allValues[0] : false
}

// Its like writing middlewares that overrides the default methods and/or adds new methods on mongo collection Groups
Meteor.methods({
  'groups.insert': insertGroup,
  'groups.findByName': findGroupByName
  // 'groups.getTasksByGroupName': async function (groupName) {
  //   console.log('filterByGroup called', groupName)
  // }
})
