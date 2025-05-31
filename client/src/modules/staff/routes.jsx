import { lazy } from 'react';
import Loadable from '@/mantisAdmin/components/Loadable';
import DashboardLayout from '@/mantisAdmin/layout/Dashboard/index';
import DashboardDefault from '@/mantisAdmin/pages/dashboard/default';
import ProtectedRoute from '@/routes/ProtectedRoute';
import MyShipperJobs from './pages/MyShipperJobs'; // Đổi tên file/component nếu muốn

// Các trang dùng lazy load
const Dashboard = Loadable(lazy(() => import('@/mantisAdmin/pages/dashboard/default')));

// Object route theo cấu trúc Dashboard
const ShipperRoutes = {
    path: 'shipper',
    element: <ProtectedRoute allowedRoles={['shipper']} />,
    children: [
        {
            element: <DashboardLayout />,
            children: [
                {
                    path: '',
                    element: <MyShipperJobs />
                },
                {
                    path: 'tasks', // hoặc 'orders'
                    element: <MyShipperJobs />
                }
                // Các route khác sẽ thêm sau khi có component
                // {
                //     path: 'orders',
                //     element: <OrderHistory />
                // },
                // {
                //     path: 'profile',
                //     element: <Profile />
                // },
                // {
                //     path: 'settings',
                //     element: <Settings />
                // }
            ]
        }
    ]
};

export default [ShipperRoutes];
