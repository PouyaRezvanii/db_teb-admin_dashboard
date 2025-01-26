import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <div style={{ padding: '20px', background: '#f0f2f5', flex: 1 }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
