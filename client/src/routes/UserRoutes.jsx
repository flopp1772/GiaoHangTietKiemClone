import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import UserLayout from '../layouts/UserLayout';
import UserDashboard from '../pages/user/Dashboard';

const UserRoutes = () => (
    <Route element={<ProtectedRoute allowedRoles={['user', 'staff', 'admin']} />}>
        <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/orders" element={<div>Đơn hàng của bạn</div>} />
            <Route path="/user/profile" element={<div>Tài khoản của bạn</div>} />
            <Route path="/user/shipping-address" element={<div>Địa chỉ giao hàng</div>} />
        </Route>
    </Route>
);

export default UserRoutes;
