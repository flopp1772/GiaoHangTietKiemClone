// src/redux/thunks/ordersThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_ENDPOINT;
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

// GET: Danh sách đơn hàng
export const fetchOrders = createAsyncThunk(
    'orders/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/orders');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Fetch orders failed');
        }
    }
);

// GET: Chi tiết đơn hàng
export const fetchOrderById = createAsyncThunk(
    'orders/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/orders/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Fetch order failed');
        }
    }
);

// POST: Tạo đơn hàng
export const createOrder = createAsyncThunk(
    'orders/create',
    async (orderData, { rejectWithValue }) => {
        try {
            console.log('[DEBUG] orderData gửi lên server:', orderData);
            const res = await axiosInstance.post('/orders', orderData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Create order failed');
        }
    }
);

// PUT: Cập nhật đơn hàng
export const updateOrder = createAsyncThunk(
    'orders/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/orders/${id}`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Update order failed');
        }
    }
);

// DELETE: Xóa mềm
export const deleteOrder = createAsyncThunk(
    'orders/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/orders/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Delete order failed');
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
