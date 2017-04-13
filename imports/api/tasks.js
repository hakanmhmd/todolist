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
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
    'tasks.insert'(text){
        check(text, String);
        
        if(!this.userId){
            throw new Meteor.Error('Not authorized to insert.');
        }
        
        Tasks.insert({
            text,
            created: new Date(),
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username,
    });
    },
    'tasks.remove'(taskId){
        check(taskId, String);
        
        const task = Tasks.findOne(taskId);
        if(task.private && task.owner !== this.userId){
            throw new Meteor.Error("Not authorized to delete.");
        }
        Tasks.remove(taskId);
    },
    'tasks.update'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
 
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
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
        if(task.owner !== this.userId){
            throw new Meteor.Error("Not authorized to make private.");
        }
        Tasks.update(taskId, {$set: {private: setPrivate}});
    }
});