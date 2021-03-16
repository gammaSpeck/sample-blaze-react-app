import { Template } from 'meteor/templating'

import './group_option.html'

Template.group_option.helpers({
  // isOwner() {
  //   return this.owner === Meteor.userId()
  // }
})

// // Register event listeners
// Template.task.events({
//   'click .toggle-checked': onTaskCheckToggled,
//   'click .delete': onTaskDeleteClicked,
//   'click .toggle-private': onSetPrivateClicked
// })
