import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

import { Tasks } from '../api/tasks.js'
import { Groups } from '../api/groups.js'

import GroupJSX from './react/components/Group'
import ToastJSX from './react/components/Toast'

import './task.js'
import './group_option.js'
import './body.html'
import { toast } from 'react-toastify'

// On body element mount, initialize a state
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict()
  this.state.set('filterByGroup', '*') // Default state
  Meteor.subscribe('tasks')
  Meteor.subscribe('groups')
})

// Setting getters so that they can be accessed inside the HTML
Template.body.helpers({
  tasks() {
    const instance = Template.instance()
    const isCompletedHidden = instance.state.get('hideCompleted')
    const groupId = instance.state.get('filterByGroup')

    const filterCondition = {}
    if (isCompletedHidden) filterCondition.checked = { $ne: true }
    if (groupId !== '*') {
      console.log('Must filter by group id', groupId)
      filterCondition.groupId = { $eq: groupId }
    }

    return Tasks.find(filterCondition, { sort: { createdAt: -1 } })
  },

  filterByGroupId() {
    return Template.instance().state.get('filterByGroup')
  },

  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count()
  },

  groups() {
    return Groups.find({})
  },

  groupAll() {
    return { _id: '*', name: 'All' }
  },

  GroupJSX() {
    return GroupJSX
  },

  ToastJSX() {
    return ToastJSX
  },

  setFilterByGroup() {
    const instance = Template.instance()

    return (groupId) => {
      // console.log('groupId passed', groupId)
      instance.state.set('filterByGroup', groupId)
    }
  }
})

//  Define Event Handlers
const onNewTaskSubmit = (event) => {
  // Prevent default browser form submit
  event.preventDefault()

  // Get value from form element
  const { target } = event
  const { value: text } = target.text
  const { value: groupName } = target.groupName

  if (!text || !groupName) return toast.error('Task and group is required')

  // Insert a task into the collection
  Meteor.call('tasks.insert', { text, groupName })

  // Clear form
  target.text.value = ''
  target.groupName.value = ''
}

const onHideCompletedCheckboxToggled = (event, instance) => {
  instance.state.set('hideCompleted', event.target.checked)
}

// Register event listeners
Template.body.events({
  'submit .new-task': onNewTaskSubmit,
  'change .hide-completed input': onHideCompletedCheckboxToggled
})
