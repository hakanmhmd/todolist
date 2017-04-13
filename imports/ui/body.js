import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';
 
import './body.html';
import './task.js';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if(instance.state.get('hideCompleted')){
        return Tasks.find({checked: {$ne: true}}, {sort: {created: -1}});
    }
    return Tasks.find({}, {sort: {created: -1}});
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
    'submit .new-task'(event){
        event.preventDefault(); //prevent default browser form
        var target = event.target;
        var text = target.text.value;
        //console.log(event)
        // securely insert a task
        Meteor.call('tasks.insert', text);
        
        target.text.value = ""; //clear form
    },
    'change .hide-completed input'(event, instance){
        instance.state.set('hideCompleted', event.target.checked);
    }
});