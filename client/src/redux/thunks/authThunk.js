import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_ENDPOINT;

// Tạo instance axios với config cơ bản
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Quan trọng: cho phép gửi/nhận cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

// Thêm response interceptor để xử lý lỗi 401
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Có thể dispatch action logout ở đây nếu cần
            console.log('Session expired');
        }
        return Promise.reject(error);
    }
);

// Thunk xử lý login
export const loginUser = createAsyncThunk(
    'auth/login',
    async (loginData, { rejectWithValue }) => {
        try {
            // Gọi API login
            const response = await axiosInstance.post('/auth/login', {
                login_id: loginData.email,
                password: loginData.password
            });

            // Chỉ trả về user data
            return {
                user: response.data.user
            };
        } catch (error) {
            console.error('Login error:', error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || 'Đăng nhập thất bại'
            );
        }
    }
);

// Thunk xử lý logout
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/auth/logout');
            return null; // Không cần trả về data gì
        } catch (error) {
            console.error('Logout error:', error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || 'Đăng xuất thất bại'
            );
        }
    }
);