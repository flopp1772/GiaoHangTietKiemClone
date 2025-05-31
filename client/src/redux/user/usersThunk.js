// src/redux/thunks/ordersThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_ENDPOINT;
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

// GET: Danh sách user
export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/users');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Fetch users failed');
        }
    }
);

// GET: Chi tiết user
export const fetchUserById = createAsyncThunk(
    'users/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/users/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Fetch user failed');
        }
    }
);

// POST: Tạo user
export const createUser = createAsyncThunk(
    'users/create',
    async (userData, { rejectWithValue }) => {
        try {
            // Format dữ liệu trước khi gửi
            const formattedData = {
                store_name: userData.store_name,
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
                role: userData.role,
                addresses: [{
                    address_detail: userData.address_detail,
                    province: userData.province,
                    district: userData.district,
                    ward: userData.ward
                }]
            };

            console.log('Data being sent to create user:', formattedData);

            const res = await axiosInstance.post('/users', formattedData);
            console.log('Response from create user:', res.data);
            return res.data;
        } catch (err) {
            console.error('Error creating user:', err.response?.data);
            return rejectWithValue(err.response?.data?.message || 'Create user failed');
        }
    }
);

// PUT: Cập nhật user
export const updateUser = createAsyncThunk(
    'users/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            // Format dữ liệu trước khi gửi
            const formattedData = {
                store_name: data.store_name,
                email: data.email,
                phone: data.phone,
                role: data.role,
                addresses: [{
                    address_detail: data.address_detail,
                    province: data.province,
                    district: data.district,
                    ward: data.ward
                }]
            };

            const res = await axiosInstance.put(`/users/${id}`, formattedData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Update user failed');
        }
    }
);

// DELETE: Xóa user
export const deleteUser = createAsyncThunk(
    'users/delete',
    async (id, { rejectWithValue }) => {
        try {
            console.log('Deleting user with id:', id);
            const res = await axiosInstance.delete(`/users/${id}`);
            console.log('Delete response:', res.data);
            return id;
        } catch (err) {
            console.error('Error deleting user:', err.response?.data);
            return rejectWithValue(err.response?.data?.message || 'Delete user failed');
        }
    }
);

// TÍNH PHÍ VẬN CHUYỂN CHO ĐƠN HÀNG
export const calculateOrderShippingFee = createAsyncThunk(
    'orders/calculateShippingFee',
    async (shippingData, { rejectWithValue }) => {
        try {
            const { addressDetail, province, district, ward } = shippingData.receiverAddress;
            const { weight, quantity } = shippingData.productInfo;

            function removePrefix(name = '') {
                return name
                    .replace(/^Tỉnh\s+/i, '')
                    .replace(/^Thành phố\s+/i, '')
                    .replace(/^Quận\s+/i, '')
                    .replace(/^Huyện\s+/i, '')
                    .replace(/^Phường\s+/i, '')
                    .replace(/^Xã\s+/i, '');
            }

            const payload = {
                receiverAddress: {
                    addressDetail: removePrefix(addressDetail),
                    province: removePrefix(province),
                    district: removePrefix(district),
                    ward: removePrefix(ward)
                },
                productInfo: {
                    weight,
                    quantity
                }
            };

            const response = await axiosInstance.post('/shipping/calculate', payload);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to calculate shipping cost'
            );
        }
    }
);
