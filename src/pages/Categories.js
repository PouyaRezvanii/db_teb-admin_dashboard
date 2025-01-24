// src/pages/Categories.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Table, Button, Input, Form, Modal, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/category/all');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Failed to fetch categories.');
        }
    };

    const handleAddOrUpdateCategory = async () => {
        try {
            if (editingCategory) {
                await api.post(`/category/update/${editingCategory._id}`, { catName: categoryName });
                setCategories(categories.map(cat => cat._id === editingCategory._id ? { ...cat, catName: categoryName } : cat));
                message.success('Category updated successfully');
            } else {
                const response = await api.post('/category/create', { catName: categoryName });
                setCategories([...categories, response.data.category]);
                message.success('Category added successfully');
            }
            setIsModalVisible(false);
            setCategoryName("");
            setEditingCategory(null);
        } catch (error) {
            console.error('Error adding/updating category:', error);
            message.error('Failed to add/update category');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/category/delete/${id}`);
            setCategories(categories.filter(category => category._id !== id));
            message.success('Category deleted successfully');
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('Failed to delete category');
        }
    };

    const columns = [
        { title: 'Category Name', dataIndex: 'catName', key: 'catName' },
        {
            title: 'Action',
            render: (text, record) => (
                <div>
                    <Button type="link" onClick={() => {
                        setEditingCategory(record);
                        setCategoryName(record.catName);
                        setIsModalVisible(true);
                    }}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Link to="/" style={{ marginBottom: '20px', display: 'inline-block', color: '#1890ff' }}>
                <ArrowLeftOutlined /> Back to Dashboard
            </Link>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Categories</h1>
            <Button
                type="primary"
                style={{ marginBottom: '20px' }}
                onClick={() => {
                    setEditingCategory(null);
                    setCategoryName("");
                    setIsModalVisible(true);
                }}
            >
                Add Category
            </Button>
            
            <Modal
                title={editingCategory ? "Edit Category" : "Add New Category"}
                visible={isModalVisible}
                onOk={handleAddOrUpdateCategory}
                onCancel={() => setIsModalVisible(false)}
                okText={editingCategory ? "Update" : "Add"}
            >
                <Form layout="vertical">
                    <Form.Item label="Category Name">
                        <Input
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Table
                dataSource={categories}
                columns={columns}
                rowKey="_id"
                bordered
                style={{ backgroundColor: '#fff' }}
            />
        </div>
    );
};

export default Categories;
