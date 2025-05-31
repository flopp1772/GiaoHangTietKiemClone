import { lazy } from 'react';
import Loadable from '@/mantisAdmin/components/Loadable';
import DashboardLayout from '@/mantisAdmin/layout/Dashboard/index';
import DashboardDefault from '@/mantisAdmin/pages/dashboard/default';
import ProtectedRoute from '@/routes/ProtectedRoute';
// import ManageUsers from './pages/users';

// Lazy load các trang
const Dashboard = Loadable(lazy(() => import('@/mantisAdmin/pages/dashboard/default')));
const ManageUsers = Loadable(lazy(() => import('./pages/users')));

// Object route theo cấu trúc Dashboard
const AdminRoutes = {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
        {
            element: <DashboardLayout />,
            children: [
                {
                    path: '',
                    element: <DashboardDefault />
                },
                {
                    path: 'manage-users',
                    element: <ManageUsers />
                },
                // Các route khác sẽ thêm sau khi có component
                // {
                //     path: 'manage-users',
                //     element: <ManageUsers />
                // },
                // {
                //   path: 'manage-staffs',
                //   element: <ManageStaffs />
                // },
                // {
                //   path: 'settings',
                //   element: <Settings />
                // },
                // {
                //   path: 'reports',
                //   element: <Reports />
                // }
            ]
        }
    ]
};

export default [AdminRoutes];
