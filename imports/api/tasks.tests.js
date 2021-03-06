import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import { Tasks } from './tasks.js';


 if(Meteor.isServer){
     describe('Tasks', () => {
         describe('methods', () => {
             const userId = Random.id();
             let taskId;
             
             beforeEach(() => {
                 Tasks.remove({});
                 taskId = Tasks.insert({
                     text: 'test',
                     created: new Date(),
                     owner: userId,
                     username: 'tester'
                 });
             });

             it('can delete own task', () => {
                 // use internal implementation of the method to test in isolation
                 const deletedTask = Meteor.server.method_handlers['tasks.delete'];
                 //set up a fake method
                 const invocation  = {userId};
                 deletedTask.apply(invocation, [taskId]);
                 
                 assert.equal(Tasks.find().count(), 0);
             });
         });
     });
 }