import React from 'react';
import { Menu } from 'antd';
import { DashboardOutlined, AppstoreOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // تعیین کلید بر اساس مسیر فعلی
    const getSelectedKey = () => {
        if (currentPath === '/') return '1';
        if (currentPath.startsWith('/products')) return '2';
        if (currentPath.startsWith('/vendors')) return '3';
        if (currentPath.startsWith('/categories')) return '4';
        return '1'; // پیش‌فرض
    };

    return (
        <div style={{ width: 256, minHeight: '100vh', backgroundColor: '#001529' }}>
            <Menu
                mode="inline"
                theme="dark"
                selectedKeys={[getSelectedKey()]}
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
