// src/routes/AdminRoutes.jsx
import React from 'react';
import { Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/Dashboard';

export const AdminRoutes = (
    <>
        <Route path="/admin" element={<AdminDashboard />} />
    </>
);
