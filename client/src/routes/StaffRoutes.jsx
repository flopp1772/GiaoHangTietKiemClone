import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import StaffLayout from '../layouts/StaffLayout';
import StaffDashboard from '../pages/staff/Dashboard';

const StaffRoutes = () => (
    <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
        <Route element={<StaffLayout />}>
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/orders" element={<div>Quản lý đơn hàng</div>} />
            <Route path="/staff/customers" element={<div>Quản lý khách hàng</div>} />
            <Route path="/staff/tasks" element={<div>Quản lý công việc</div>} />
            <Route path="/staff/reports" element={<div>Báo cáo</div>} />
        </Route>
    </Route>
);

export default StaffRoutes;
