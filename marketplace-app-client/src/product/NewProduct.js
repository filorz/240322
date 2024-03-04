import React, { Component } from 'react';
import {createCategory, createProduct, getAllCategory, getAllProducts} from '../util/APIUtils';
import {MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH, PRODUCT_LIST_SIZE} from '../constants';
import './NewProduct.css';
import { Form, Input, Button, Radio, notification } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input

class NewProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                text: ''
            },
            description: {
                text: ''
            },
            price: {
                text: ''
            },
            categoryId: {
                text: ''
            },
            categories: []
        }
        this.addCategory = this.addCategory.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this),
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handlePriceChange = this.handlePriceChange.bind(this)
        this.handleCategoryIdChange = this.handleCategoryIdChange.bind(this)
    }

    loadProductsList(page = 0, size = PRODUCT_LIST_SIZE) {
        let promise;
        promise = getAllCategory();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                this.setState({
                    categories: response,
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });
    }

    componentDidMount() {
        this.loadProductsList();
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
        const productData = {
            name: this.state.name.text,
            description: this.state.description.text,
            price: this.state.price.text,
            categoryId: this.state.categoryId.text
        };

        createProduct(productData)
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

    handlePriceChange(event) {
        const value = event.target.value;
        this.setState({
            price: {
                text: value,
                ...this.validateName(value)
            }
        });
    }

    handleCategoryIdChange(event) {
        const value = event.target.value;
        this.setState({
            categoryId: {
                text: value
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
                <h1 className="page-title">Create New Product</h1>
                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-category-form">
                        <FormItem className="poll-form-row">
                            <Input
                                size="large"
                                name="name"
                                autoComplete="off"
                                placeholder="Enter Name product"
                                onChange={this.handleNameChange}/>
                            <Input
                                size="large"
                                name="price"
                                autoComplete="off"
                                placeholder="Enter price product"
                                onChange={this.handlePriceChange}/>
                            <Radio.Group defaultValue="a" buttonStyle="solid">
                                {this.state.categories.map((item) => (
                                        <Radio.Button onChange={this.handleCategoryIdChange} value={item.id}>{item.name}</Radio.Button>)
                                    )}
                            </Radio.Group>
                        </FormItem>
                        <FormItem className="poll-form-row">
                            <TextArea
                                placeholder="Enter description"
                                style={{fontSize: '16px'}}
                                autosize={{minRows: 4, maxRows: 6}}
                                name="description"
                                value={this.state.description.text}
                                onChange={this.handleDescriptionChange}/>
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

export default NewProduct;