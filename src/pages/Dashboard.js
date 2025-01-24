// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Card, Row, Col, message } from 'antd';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        productsCount: 0,
        categoriesCount: 0,
        vendorsCount: 0,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const productsRes = await api.get('/product/all');
            const categoriesRes = await api.get('/category/all');
            const vendorsRes = await api.get('/vendor/all');

            setStats({
                productsCount: productsRes.data.products.length,
                categoriesCount: categoriesRes.data.categories.length,
                vendorsCount: vendorsRes.data.vendors.length,
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
            message.error('Failed to fetch data');
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
                <Header />
                <div style={{ padding: '20px' }}>
                    <h1>Dashboard</h1>
                    <p>Welcome to the admin dashboard.</p>
                    <Row gutter={16} style={{ marginTop: '20px' }}>
                        <Col span={8}>
                            <Card title="Total Products" bordered={false}>
                                <p style={{ fontSize: '24px', margin: 0 }}>{stats.productsCount}</p>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Total Categories" bordered={false}>
                                <p style={{ fontSize: '24px', margin: 0 }}>{stats.categoriesCount}</p>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Total Vendors" bordered={false}>
                                <p style={{ fontSize: '24px', margin: 0 }}>{stats.vendorsCount}</p>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
