import { Template } from 'meteor/templating'

import './group.html'
import GroupJSX from './react/components/Group'

Template.group.helpers({
  GroupJSX() {
    return GroupJSX
  }
})
