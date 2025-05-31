import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_ENDPOINT;
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

// Lấy danh sách task giao hàng của shipper
export const fetchShipperTasks = createAsyncThunk(
    'shipper/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/shipper/tasks');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Fetch shipper tasks failed');
        }
    }
);

// Lấy chi tiết 1 task giao hàng
export const fetchShipperTaskById = createAsyncThunk(
    'shipper/fetchTaskById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/shipper/tasks/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Fetch shipper task failed');
        }
    }
);

// Tạo task giao hàng mới (ít dùng, chủ yếu cho test/demo)
export const createShipperTask = createAsyncThunk(
    'shipper/createTask',
    async (taskData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/shipper/tasks', taskData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Create shipper task failed');
        }
    }
);

// Cập nhật task giao hàng (trạng thái, ghi chú, ...)
export const updateShipperTask = createAsyncThunk(
    'shipper/updateTask',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/shipper/tasks/${id}`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Update shipper task failed');
        }
    }
);

// Xoá task giao hàng (ít dùng)
export const deleteShipperTask = createAsyncThunk(
    'shipper/deleteTask',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/shipper/tasks/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Delete shipper task failed');
        }
    }
);
