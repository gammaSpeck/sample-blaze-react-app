import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

import { Tasks } from '../api/tasks.js'

import './task.js'
import './body.html'

// On body element mount, initialize a state
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict()
  Meteor.subscribe('tasks')
})

// Setting getters so that they can be accessed inside the HTML
Template.body.helpers({
  tasks() {
    const instance = Template.instance()
    const filterCondition = instance.state.get('hideCompleted')
      ? { checked: { $ne: true } }
      : {}

    return Tasks.find(filterCondition, { sort: { createdAt: -1 } })
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count()
  }
})

//  Define Event Handlers
const onNewTaskSubmit = (event) => {
  // Prevent default browser form submit
  event.preventDefault()

  // Get value from form element
  const { target } = event
  const { value: text } = target.text

  // Insert a task into the collection
  Meteor.call('tasks.insert', text)

  // Clear form
  target.text.value = ''
}

const onHideCompletedCheckboxToggled = (event, instance) => {
  instance.state.set('hideCompleted', event.target.checked)
}

// Register event listeners
Template.body.events({
  'submit .new-task': onNewTaskSubmit,
  'change .hide-completed input': onHideCompletedCheckboxToggled
})
