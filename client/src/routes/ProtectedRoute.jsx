import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Component để bảo vệ các route cần xác thực
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useSelector(state => state.auth);

    // Chưa xác thực
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Kiểm tra quyền truy cập
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Chuyển hướng dựa vào role
        const roleRoutes = {
            admin: '/admin',
            shipper: '/shipper',
            customer: '/customer'
        };

        return <Navigate to={roleRoutes[user.role] || '/'} replace />;
    }

    // Cho phép truy cập
    return <Outlet />;
};

export default ProtectedRoute;
