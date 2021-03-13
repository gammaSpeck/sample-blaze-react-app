import { Template } from 'meteor/templating'

import './group.html'
import Group from './react/components/Group'

Template.group.helpers({
  Group() {
    return Group
  }
})
