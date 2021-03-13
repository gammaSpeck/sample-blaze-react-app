import { Template } from 'meteor/templating'

import './task.html'

Template.task.helpers({
  isOwner() {
    return this.owner === Meteor.userId()
  }
})

// Has to have function keyword as this should reference the Task object
const onTaskCheckToggled = function () {
  // Set the checked property to the opposite of its current value
  Meteor.call('tasks.setChecked', this._id, !this.checked)
}

const onTaskDeleteClicked = function () {
  Meteor.call('tasks.remove', this._id)
}

const onSetPrivateClicked = function () {
  Meteor.call('tasks.setPrivate', this._id, !this.private)
}

// Register event listeners
Template.task.events({
  'click .toggle-checked': onTaskCheckToggled,
  'click .delete': onTaskDeleteClicked,
  'click .toggle-private': onSetPrivateClicked
})
