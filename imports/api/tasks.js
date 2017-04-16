import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { ownerId: this.userId },
      ],
    });
  });
}

Meteor.methods({
    'tasks.insert'(text){
        check(text, String);
        
        // Make sure the user is logged in before inserting a task
        if(!Meteor.userId()){
            throw new Meteor.Error('Not authorized to insert.');
        }
        
        Tasks.insert({
            text,
            created: new Date(),
            ownerId: Meteor.userId(),
            ownerName: Meteor.user().username,
            private: false,
        });
    },

    'tasks.delete'(taskId){
        check(taskId, String);
        
        const task = Tasks.findOne(taskId);
        if(task.private && task.ownerId !== Meteor.userId()){
            // If the task is private, make sure only the owner can delete
            throw new Meteor.Error("Not authorized to delete.");
        }
        Tasks.remove(taskId);
    },

    'tasks.update'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);
 
        const task = Tasks.findOne(taskId);
        if (task.private && task.ownerId !== Meteor.userId()) {
            // If the task is private, make sure only the owner can check it off
            throw new Meteor.Error('Not authorized to set checked.');
        }
    
        Tasks.update(taskId, { $set: { checked: setChecked } });
    },

    'tasks.setPrivate'(taskId, setPrivate){
        check(taskId, String);
        check(setPrivate, Boolean);
        
        const task = Tasks.findOne(taskId);
        //only the task owner can make it private
        if(task.ownerId !== Meteor.userId()){
            throw new Meteor.Error("Not authorized to make private.");
        }
        Tasks.update(taskId, {$set: {private: setPrivate}});
    }
}); 