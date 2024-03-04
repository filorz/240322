import React, { Component } from 'react';
import {
    deleteProduct,
    getAllCategory,
    getProductsByCategoryId
} from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import {Button, Icon, Table, notification, Popconfirm, Radio, Form, Input} from 'antd';
import './ProductList.css';

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCategory: {},
            categoryList: [],
            role: '',
            filter: {
                startPrice: 0,
                endPrice: 0,
                categoryId: 0,
                page: 0,
                size: 10,
            },
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadProductsList = this.loadProductsList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleCategoryIdChange = this.handleCategoryIdChange.bind(this);
    }

    loadProductsList(categoryId) {
        let filter = {
            startPrice: this.state.filter.startPrice,
            endPrice: this.state.filter.endPrice,
            categoryId: categoryId,
            page: this.state.filter.page,
            size: this.state.filter.size
        };
        let promise;
        let promiseCategories;
        promiseCategories = getAllCategory();
        promise = getProductsByCategoryId(filter);

        if(!promise || !promiseCategories) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promiseCategories
        .then(response => {
            this.setState({
                categoryList: response,
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

        promise
        .then(response => {
            this.setState({
                currentCategory: response.content[0],
                filter: {
                    startPrice: 0,
                    endPrice: 0,
                    categoryId: response.content[0].id,
                    page: 0,
                    size: 10,
                },
                page: response.page,
                size: response.size,
                role: response.content[0].role,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            });

        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });
    }

    deleteProduct(key) {
        let promise;
        promise = deleteProduct(key);
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });

        promise
        .then(response => {
            notification.success({
                message: 'Marketplace App',
                description: "You're successfully Delete Product.",
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });
    }

    componentDidMount() {
        this.loadProductsList(this.state.filter.categoryId);
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                currentCategory: {},
                categoryList: [],
                filter: {
                    page: 0,
                    size: 10,
                },
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });
            this.loadProductsList();
        }
    }

    handleLoadMore() {
        this.loadProductsList(this.state.filter.page + 1);
    }

    handleDelete(key) {
        this.deleteProduct(key);
    }

    handleCategoryIdChange(event) {
        const value = event.target.value;
        this.loadProductsList(value);
    }

    render() {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: 'Action',
                dataIndex: '',
                key: 'x',
                render: (_, record: { key: React.Key }) =>
                    data.length >= 1 ? (
                        <Popconfirm disabled={this.state.role !== 'ROLE_ADMIN'} title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];

        let data = this.state.currentCategory && this.state.currentCategory.products;
        let catId = this.state.currentCategory.id && this.state.currentCategory.id;

        return (
            <div className="products-container">
                <Radio.Group className="categories-container" defaultValue={catId} buttonStyle="solid">
                    {this.state.categoryList && this.state.categoryList.map((item) => (
                        <Radio.Button onChange={this.handleCategoryIdChange} value={item.id}>{item.name}</Radio.Button>)
                    )}
                </Radio.Group>
                <Form.Item label="Цена От:">
                    <Input placeholder="Цена От" />
                </Form.Item>
                <Form.Item label="Цена До:">
                    <Input placeholder="Цена До" />
                </Form.Item>
                <Form.Item >
                    <Button onClick={this.handleFiltering} type="primary">Фильтровать</Button>
                </Form.Item>
                <Table
                    columns={columns}
                    expandable={{
                        expandedRowRender: (record) => (
                            <p
                                style={{
                                    margin: 0,
                                }}
                            >
                                {record.description}
                            </p>
                        ),
                        rowExpandable: (record) => record.name !== 'Not Expandable',
                    }}
                    dataSource={data}
                />
                {
                    !this.state.isLoading && this.state.currentCategory && this.state.currentCategory.length === 0 ? (
                        <div className="no-products-found">
                            <span>No Products Found.</span>
                        </div>    
                    ): null
                }  
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-polls"> 
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }              
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        );
    }
}

export default ProductList;