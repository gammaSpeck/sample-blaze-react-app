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
const insertGroup = function (groupName) {
  check(groupName, String)

  const existing = Groups.find({
    name: { $eq: groupName }
  })
  if (existing) throw new Meteor.Error('duplicate-entry-group')

  Groups.insert({
    name: groupName,
    createdAt: new Date(),
    owner: this.userId,
    username: Meteor.users.findOne(this.userId).username
  })
}

// Its like writing middlewares that overrides the default methods and/or adds new methods on mongo collection Groups
Meteor.methods({
  'groups.insert': insertGroup
})
