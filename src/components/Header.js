// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

const Header = () => {
    return (
        <div style={{ padding: '20px', background: '#001529', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
            <Link to="/" style={{ color: '#fff', fontSize: '16px' }}>
                <HomeOutlined style={{ marginRight: '8px' }} />
                Go to Main Site
            </Link>
        </div>
    );
};

export default Header;
