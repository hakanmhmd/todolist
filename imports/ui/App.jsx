import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import {Tasks} from '../api/tasks.js';
import Task from './Task.jsx';
 
// App component - represents the whole app
class App extends Component {

    constructor(){
        super();
        this.state = {
            taskTitle: ''
        };
    }
    renderTasks() {
        return this.props.tasks.map((task) => (
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
            createdAt: new Date()
        });
        this.setState({ taskTitle: '' });
    }
    
    render() {
        return (
        <div className="container">
            <header>
                <h1>Todo List</h1>
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
    tasks: PropTypes.array.isRequired
};

// Exposing the collection data to React
export default AppContainer = createContainer(() => {
    return {
        tasks: Tasks.find({}).fetch()
    };
}, App);