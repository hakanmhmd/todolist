import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Tasks} from '../api/tasks.js';
// Task component - represents a single todo item
class Task extends Component {

    toggleChecked() {
        Tasks.update(this.props.task._id, {
            $set: { checked: !this.props.task.checked}
        });
    }

    deleteThisTask() {
        Tasks.remove(this.props.task._id);
    }
    
    render() {
        const taskChecked = this.props.task.checked ? 'checked' : '';
        return (
            <li className={taskChecked}>
                <button 
                    className="delete" 
                    onClick={this.deleteThisTask.bind(this)}>
                        &times;
                </button>

                <input 
                    type="checkbox"
                    readOnly
                    checked={this.props.task.checked}
                    onClick={this.toggleChecked.bind(this)}
                /> 
                <span className="text">
                    <strong>{this.props.task.ownerName}</strong> - {this.props.task.text}
                </span>
            </li>
        );
    }
}

Task.propTypes = {
    task: PropTypes.object.isRequired
};

export default Task;