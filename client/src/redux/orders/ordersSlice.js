// src/redux/slices/ordersSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
} from '../orders/ordersThunk';

const initialState = {
    list: [],
    selected: null,
    form: {
        shippingFee: 0,
        shippingAddress: {
            addressDetail: '',
            province: '',
            district: '',
            ward: '',
            zip: '',
            receiverCoords: null,
        },
        productName: '',
        description: '',
        recipientName: '',
        recipientPhone: '',
        weight: 1,
        quantity: 1,
    },
    loading: false,
    error: null,
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearSelectedOrder: (state) => {
            state.selected = null;
        },
        clearOrderError: (state) => {
            state.error = null;
        },
        setOrderFormField: (state, action) => {
            const { field, value } = action.payload;
            if (field in state.form) {
                state.form[field] = value;
            }
        },
        setOrderShippingAddressField: (state, action) => {
            const { field, value } = action.payload;
            if (field in state.form.shippingAddress) {
                state.form.shippingAddress[field] = value;
            }
        },
        setOrderForm: (state, action) => {
            state.form = { ...state.form, ...action.payload };
        },
        resetOrderForm: (state) => {
            state.list = initialState.list;
            state.selected = initialState.selected;
            state.form = initialState.form;
            state.loading = initialState.loading;
            state.error = initialState.error;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.selected = action.payload;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const index = state.list.findIndex((o) => o.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
                if (state.selected?.id === action.payload.id) {
                    state.selected = action.payload;
                }
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.list = state.list.filter((o) => o.id !== action.payload);
                if (state.selected?.id === action.payload) {
                    state.selected = null;
                }
            });
    },
});

export const { clearSelectedOrder, clearOrderError, setOrderFormField, setOrderShippingAddressField, setOrderForm, resetOrderForm } = ordersSlice.actions;
export default ordersSlice.reducer;
