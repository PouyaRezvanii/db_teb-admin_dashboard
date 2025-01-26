import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MainLayout from '../components/MainLayout';
import { Table, Button, message, Input, Form, Modal, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        productUrl: '',
        image: '',
        categories: [],
        vendor: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchVendors();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/product/all');
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
            message.error('Failed to fetch products.');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/category/all');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Failed to fetch categories.');
        }
    };

    const fetchVendors = async () => {
        try {
            const response = await api.get('/vendor/all');
            setVendors(response.data.vendors);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            message.error('Failed to fetch vendors.');
        }
    };

    const handleAddOrUpdateProduct = async () => {
        try {
            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('description', productData.description);
            formData.append('price', productData.price);
            formData.append('productUrl', productData.productUrl);

            if (productData.categories && productData.categories.length > 0) {
                productData.categories.forEach((categoryId) => formData.append('categories[]', categoryId));
            } else {
                message.error('Please select at least one category.');
                return;
            }

            if (productData.vendor) {
                formData.append('vendor', productData.vendor);
            } else {
                message.error('Please select a vendor.');
                return;
            }

            if (!editingProduct && !selectedFile) {
                message.error('Please select an image.');
                return;
            }

            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            if (editingProduct) {
                await api.post(`/product/update/${editingProduct._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                message.success('Product updated successfully');
            } else {
                await api.post('/product/create', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                message.success('Product added successfully');
            }

            setIsModalVisible(false);
            resetProductData();
            fetchProducts();
        } catch (error) {
            console.error('Error adding/updating product:', error.response?.data || error.message);
            message.error('Failed to add/update product');
        }
    };

    const handleFileChange = (info) => {
        if (info.file.status === 'done' || info.file.status === 'uploading') {
            setSelectedFile(info.file.originFileObj);
        } else if (info.file.status === 'error') {
            message.error('Failed to upload image');
        }
    };

    const handleDelete = async (productId) => {
        try {
            await api.delete(`/product/delete/${productId}`);
            setProducts(products.filter(product => product._id !== productId));
            message.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            message.error('Failed to delete product');
        }
    };

    const resetProductData = () => {
        setProductData({
            name: '',
            description: '',
            price: '',
            productUrl: '',
            image: '',
            categories: [],
            vendor: ''
        });
        setEditingProduct(null);
        setSelectedFile(null);
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
        { title: 'Description', dataIndex: 'description', key: 'description', width: 200 },
        { title: 'Price', dataIndex: 'price', key: 'price', width: 100 },
        {
            title: 'Categories',
            render: (text, record) => (
                <span>
                    {record.categories && record.categories.length > 0
                        ? record.categories.map(catId => {
                            const category = categories.find(c => c._id === catId);
                            return category ? category.catName : 'Not Found';
                        }).join(', ')
                        : 'No Category'}
                </span>
            ),
            width: 150,
        },
        {
            title: 'Vendor',
            render: (text, record) => {
                const vendor = vendors.find(v => v._id === record.vendor);
                return vendor ? vendor.name : 'Not Found';
            },
            width: 150,
        },
        {
            title: 'Product URL',
            render: (text, record) => (
                <span>{record.productUrl ? <a href={record.productUrl} target="_blank" rel="noopener noreferrer">{record.productUrl}</a> : 'No URL'}</span>
            ),
            width: 200,
        },
        {
            title: 'Image',
            render: (text, record) => (
                <img 
                    src={`https://db-teb-api.onrender.com/${record.image}`} 
                    alt={record.name} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                />
            ),
            width: 100,
        },
        {
            title: 'Action',
            render: (text, record) => (
                <div>
                    <Button type="link" onClick={() => {
                        setEditingProduct(record);
                        setProductData(record);
                        setIsModalVisible(true);
                    }}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </div>
            ),
            width: 150,
        },
    ];

    return (
        <MainLayout selectedKey="products">
            <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
                
                <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Products</h1>
                <Button
                    type="primary"
                    style={{ marginBottom: '20px' }}
                    onClick={() => {
                        setEditingProduct(null);
                        setIsModalVisible(true);
                    }}
                >
                    Add Product
                </Button>
                
                <Modal
                    title={editingProduct ? "Edit Product" : "Add New Product"}
                    open={isModalVisible}
                    onOk={handleAddOrUpdateProduct}
                    onCancel={() => setIsModalVisible(false)}
                    okText={editingProduct ? "Update" : "Add"}
                >
                    <Form layout="vertical">
                        <Form.Item label="Name">
                            <Input
                                value={productData.name}
                                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="Description">
                            <Input.TextArea
                                value={productData.description}
                                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="Price">
                            <Input
                                type="number"
                                value={productData.price}
                                onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="Categories">
                            <Select
                                mode="multiple"
                                value={productData.categories}
                                onChange={(value) => setProductData({ ...productData, categories: value })}
                            >
                                {categories.map((category) => (
                                    <Option key={category._id} value={category._id}>{category.catName}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Vendor">
                            <Select
                                value={productData.vendor}
                                onChange={(value) => setProductData({ ...productData, vendor: value })}
                            >
                                {vendors.map((vendor) => (
                                    <Option key={vendor._id} value={vendor._id}>{vendor.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Product URL">
                            <Input
                                value={productData.productUrl}
                                onChange={(e) => setProductData({ ...productData, productUrl: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="Image">
                            <Upload
                                customRequest={({ file, onSuccess }) => {
                                    setSelectedFile(file);
                                    onSuccess();
                                }}
                                showUploadList={false}
                                onChange={handleFileChange}
                            >
                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>

                <Table
                    dataSource={products}
                    columns={columns}
                    rowKey={(record) => record._id}
                    bordered
                    scroll={{ x: 'max-content' }}
                    style={{ backgroundColor: '#fff', overflowX: 'auto' }}
                />
            </div>
        </MainLayout>
    );
};

export default Products;
