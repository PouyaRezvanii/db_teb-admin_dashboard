import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Button, Input, Form, Modal, message } from 'antd';
// import { ArrowLeftOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';

const Vendors = () => {
    const [vendors, setVendors] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [vendorData, setVendorData] = useState({ name: '', website: '' });

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const response = await api.get('/vendor/all');
            setVendors(response.data.vendors);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            message.error('Failed to fetch vendors.');
        }
    };

    const handleAddOrUpdateVendor = async () => {
        try {
            if (editingVendor) {
                await api.post(`/vendor/update/${editingVendor._id}`, vendorData);
                setVendors(vendors.map(vendor => vendor._id === editingVendor._id ? { ...vendor, ...vendorData } : vendor));
                message.success('Vendor updated successfully');
            } else {
                const response = await api.post('/vendor/create', vendorData);
                setVendors([...vendors, response.data.vendor]);
                message.success('Vendor added successfully');
            }
            setIsModalVisible(false);
            setVendorData({ name: '', website: '' });
            setEditingVendor(null);
        } catch (error) {
            console.error('Error adding/updating vendor:', error);
            message.error('Failed to add/update vendor');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/vendor/delete/${id}`);
            setVendors(vendors.filter(vendor => vendor._id !== id));
            message.success('Vendor deleted successfully');
        } catch (error) {
            console.error('Error deleting vendor:', error);
            message.error('Failed to delete vendor');
        }
    };

    const columns = [
        { title: 'Vendor Name', dataIndex: 'name', key: 'name' },
        { title: 'Website', dataIndex: 'website', key: 'website' },
        {
            title: 'Action',
            render: (text, record) => (
                <div>
                    <Button
                        type="link"
                        onClick={() => {
                            setEditingVendor(record);
                            setVendorData(record);
                            setIsModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record._id)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <MainLayout>
            
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Vendors</h1>
            <Button
                type="primary"
                style={{ marginBottom: '20px' }}
                onClick={() => {
                    setEditingVendor(null);
                    setVendorData({ name: '', website: '' });
                    setIsModalVisible(true);
                }}
            >
                Add Vendor
            </Button>

            <Modal
                title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                visible={isModalVisible}
                onOk={handleAddOrUpdateVendor}
                onCancel={() => setIsModalVisible(false)}
                okText={editingVendor ? 'Update' : 'Add'}
            >
                <Form layout="vertical">
                    <Form.Item label="Vendor Name">
                        <Input
                            value={vendorData.name}
                            onChange={(e) =>
                                setVendorData({ ...vendorData, name: e.target.value })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Website">
                        <Input
                            value={vendorData.website}
                            onChange={(e) =>
                                setVendorData({ ...vendorData, website: e.target.value })
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Table
                dataSource={vendors}
                columns={columns}
                rowKey="_id"
                bordered
                style={{ backgroundColor: '#fff' }}
            />
        </MainLayout>
    );
};

export default Vendors;
