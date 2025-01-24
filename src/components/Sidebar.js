// src/components/Sidebar.js
import React from 'react';
import { Menu } from 'antd';
import { DashboardOutlined, AppstoreOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div style={{ width: 256, minHeight: '100vh', backgroundColor: '#001529' }}>
            <Menu
                mode="inline"
                theme="dark"
                defaultSelectedKeys={['1']}
                style={{ height: '100%', borderRight: 0 }}
            >
                <Menu.Item key="1" icon={<DashboardOutlined />}>
                    <Link to="/">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<AppstoreOutlined />}>
                    <Link to="/products">Products</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<UserOutlined />}>
                    <Link to="/vendors">Vendors</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<ShopOutlined />}>
                    <Link to="/categories">Categories</Link>
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default Sidebar;
