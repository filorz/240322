import React, { Component } from 'react';
import {createCategory, createProduct} from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewProduct.css';
import { Form, Input, Button, Icon, Select, Col, notification } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input

class NewCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                text: ''
            },
            description: {
                text: ''
            }
        }
        this.addCategory = this.addCategory.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this),
        this.handleNameChange = this.handleNameChange.bind(this)
    }

    addCategory(event) {
        const description = this.state.description.slice();
        this.setState({
            description: description.concat([{
                text: ''
            }])
        });
    }

    removeCategory(categoryId) {
        const choices = this.state.choices.slice();
        this.setState({
            choices: [...choices.slice(0, categoryId), ...choices.slice(categoryId+1)]
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const categoryData = {
            name: this.state.name.text,
            description: this.state.description.text,
        };

        createCategory(categoryData)
        .then(response => {
            this.props.history.push("/");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create poll.');    
            } else {
                notification.error({
                    message: 'Marketplace App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
        });
    }

    validateDescription = (descriptionText) => {
        if(descriptionText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your question!'
            }
        } else if (descriptionText.length > POLL_QUESTION_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Question is too long (Maximum ${POLL_QUESTION_MAX_LENGTH} characters allowed)`
            }    
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    validateName = (text) => {
        if(text.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter a choice!'
            }
        } else if (text.length > POLL_CHOICE_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Choice is too long (Maximum ${POLL_CHOICE_MAX_LENGTH} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleDescriptionChange(event) {
        const value = event.target.value;
        this.setState({
            description: {
                text: value,
                ...this.validateDescription(value)
            }
        });
    }

    handleNameChange(event) {
        const value = event.target.value;
        this.setState({
            name: {
                text: value,
                ...this.validateName(value)
            }
        });
    }

    isFormInvalid() {
        if(this.state.description.validateStatus !== 'success') {
            return true;
        }

        if(this.state.name.validateStatus !== 'success') {
            return true;
        }

        for(let i = 0; i < this.state.description.length; i++) {
            const description = this.state.description[i];
            if(description.validateStatus !== 'success') {
                return true;
            }
        }
    }

    render() {
        return (
            <div className="new-poll-container">
                <h1 className="page-title">Create New Category</h1>
                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-category-form">
                        <FormItem className="poll-form-row">
                            <Input
                                size="large"
                                name="name"
                                autoComplete="off"
                                placeholder="Enter Name category"
                                onChange = {this.handleNameChange} />
                        </FormItem>
                        <FormItem className="poll-form-row">
                            <TextArea
                                placeholder="Enter description"
                                style = {{ fontSize: '16px' }}
                                autosize={{ minRows: 4, maxRows: 6 }}
                                name = "description"
                                value = {this.state.description.text}
                                onChange = {this.handleDescriptionChange} />
                        </FormItem>
                        <FormItem className="poll-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                disabled={this.isFormInvalid()}
                                className="create-poll-form-button">Create</Button>
                        </FormItem>
                    </Form>
                </div>    
            </div>
        );
    }
}

export default NewCategory;