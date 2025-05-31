import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthGuard = ({ children }) => {
    const { isAuthenticated, user } = useSelector(state => state.auth);

    // Nếu đã đăng nhập, chuyển về dashboard tương ứng với role
    if (isAuthenticated && user) {
        const roleRoutes = {
            admin: '/admin',
            customer: '/customer',
            shipper: '/shipper'
        };

        return <Navigate to={roleRoutes[user.role] || '/'} replace />;
    }

    // Nếu chưa đăng nhập, cho phép truy cập trang auth
    return children;
};

export default AuthGuard; 