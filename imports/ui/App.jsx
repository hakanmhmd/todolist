import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import {Tasks} from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { Meteor } from 'meteor/meteor';

// App component - represents the whole app
class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            taskTitle: '',
            hideCompleted: false
        };
    }
    renderTasks() {
        let filteredTasks = this.props.tasks;
        if(this.state.hideCompleted){
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }
        return filteredTasks.map((task) => {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = task.ownerId === currentUserId;
            
            return (
                <Task 
                    key={task._id} 
                    task={task}
                    showPrivateButton={showPrivateButton} />
            );
        });
    }

    handleChange(e) {
        this.setState({ taskTitle: e.target.value });
    }

    handleClick(e) {
        e.preventDefault();
        const text = this.state.taskTitle;
        Meteor.call('tasks.insert', text);
        this.setState({ taskTitle: '' });
    }

    toggleHideCompleted() {

        this.setState({hideCompleted: !this.state.hideCompleted});
    }
    
    render() {
        return (
        <div className="container">
            <header>
                <h1>Todo List: {this.props.incompleteCount} tasks to completed</h1>
                <label className="hide-completed">
                <input 
                    type="checkbox"
                    readOnly
                    onClick={this.toggleHideCompleted.bind(this)}
                    checked={this.state.hideCompleted} /> 
                    Hide Completed Tasks
                </label>
                <AccountsUIWrapper />
                {this.props.currentUser ?
                <form className="new-task" onSubmit={this.handleClick.bind(this)}>
                    <input
                        type="text"
                        onChange={ this.handleChange.bind(this) }
                        placeholder="Add new task"
                        value={this.state.taskTitle} />
                </form> : '' }
            </header>
    
            <ul>
            {this.renderTasks()}
            </ul>
        </div>
        );
    }
}

App.propTypes = {
    tasks: PropTypes.array.isRequired,
    incompleteCount: PropTypes.number.isRequired,
    currentUser: PropTypes.object,
};

// Exposing the collection data to React
export default AppContainer = createContainer(() => {
    Meteor.subscribe('tasks');
    return {
        tasks: Tasks.find({}, { sort: {createdAt: -1}}).fetch(),
        incompleteCount: Tasks.find({checked: false}).count(),
        currentUser: Meteor.user()
    };
}, App);