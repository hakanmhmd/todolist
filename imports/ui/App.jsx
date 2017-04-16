import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import {Tasks} from '../api/tasks.js';
import Task from './Task.jsx';
 
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
        return filteredTasks.map((task) => (
            <Task key={task._id} task={task} />
        ));
    }

    handleChange(e) {
        this.setState({ taskTitle: e.target.value });
    }

    handleClick(e) {
        e.preventDefault();
        const text = this.state.taskTitle;
        Tasks.insert({
            text,
            createdAt: new Date(),
            checked: false
        });
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
                <form className="new-task" onSubmit={this.handleClick.bind(this)}>
                    <input
                        type="text"
                        onChange={ this.handleChange.bind(this) }
                        placeholder="Add new task"
                        value={this.state.taskTitle} />
                </form> 
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
};

// Exposing the collection data to React
export default AppContainer = createContainer(() => {
    return {
        tasks: Tasks.find({}, { sort: {createdAt: -1}}).fetch(),
        incompleteCount: Tasks.find({checked: false}).count()
    };
}, App);