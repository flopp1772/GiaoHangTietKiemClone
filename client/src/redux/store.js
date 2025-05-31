import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import authReducer from './auth/authReducer';
import ordersReducer from './orders/ordersSlice';
import usersReducer from './user/usersSlice';

// Persist config riêng cho auth
const authPersistConfig = {
    key: 'auth',
    storage,
    blacklist: ['error', 'loading'], // loại bỏ các field con
};

// Persist config cho orders
const ordersPersistConfig = {
    key: 'orders',
    storage,
    whitelist: ['form'], // chỉ lưu form (hoặc thêm 'list' nếu muốn persist list)
    blacklist: ['error', 'loading'],
};

// Wrap từng reducer với persistReducer riêng
const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    orders: persistReducer(ordersPersistConfig, ordersReducer),
    users: usersReducer, // nếu muốn persist

});

// Tạo store với rootReducer
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
            },
        }),
});

export const persistor = persistStore(store);

// Debug logs trong development
if (process.env.NODE_ENV === 'development') {
    store.subscribe(() => {
        const state = store.getState();
        // console.log('Store updated:', state);
        // console.log('Current auth state:', state.auth);
        console.log('Current orders state:', state.orders);
    });
}

export default store;
