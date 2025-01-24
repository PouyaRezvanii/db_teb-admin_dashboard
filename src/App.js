// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Vendors from './pages/Vendors';
import Users from './pages/Users';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/users" element={<Users />} />
        </Routes>
    </Router>
);

export default App;
