// src/modules/auth/routes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthGuard from './guards/AuthGuard';
import Login from '@/mantisAdmin/pages/auth/Login';
import Register from '@/mantisAdmin/pages/auth/Register';

// Các route dành cho auth (public)
const authRoutes = [
    {
        path: '/login',
        element: (
            <AuthGuard>
                <Login />
            </AuthGuard>
        )
    },
    {
        path: '/register',
        element: (
            <AuthGuard>
                <Register />
            </AuthGuard>
        )
    },
    {
        path: '/auth',
        element: <Navigate to="/login" replace />
    }
];

export default authRoutes;
