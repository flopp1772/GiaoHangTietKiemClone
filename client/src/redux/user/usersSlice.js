// src/redux/slices/ordersSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
} from './usersThunk';

const initialState = {
    list: [],
    selected: null,
    loading: false,
    error: null,
    form: {
        store_name: '',
        email: '',
        phone: '',
        password: '',
        role: '',
        address_detail: '',
        province: '',
        district: '',
        ward: ''
    }
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearSelectedUser: (state) => {
            state.selected = null;
        },
        clearUserError: (state) => {
            state.error = null;
        },
        setFormData: (state, action) => {
            state.form = { ...state.form, ...action.payload };
        },
        resetForm: (state) => {
            state.form = initialState.form;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.selected = action.payload;
                state.form = {
                    store_name: action.payload.store_name || '',
                    email: action.payload.email || '',
                    phone: action.payload.phone || '',
                    role: action.payload.role || '',
                    address_detail: action.payload.address_detail || '',
                    province: action.payload.province || '',
                    district: action.payload.district || '',
                    ward: action.payload.ward || ''
                };
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.list.push(action.payload);
                state.form = initialState.form;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.list.findIndex((u) => u.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
                if (state.selected?.id === action.payload.id) {
                    state.selected = action.payload;
                }
                state.form = initialState.form;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.list = state.list.filter((u) => u.id !== action.payload);
                if (state.selected?.id === action.payload) {
                    state.selected = null;
                }
            });
    },
});

export const {
    clearSelectedUser,
    clearUserError,
    setFormData,
    resetForm
} = usersSlice.actions;

export default usersSlice.reducer;
