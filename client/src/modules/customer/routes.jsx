import { lazy } from 'react';
import Loadable from '@/mantisAdmin/components/Loadable';
import DashboardLayout from '@/mantisAdmin/layout/Dashboard/index';
import DashboardDefault from '@/mantisAdmin/pages/dashboard/default';
import ProtectedRoute from '@/routes/ProtectedRoute';
import Checkout from '@/mantisAdmin/components/Checkout';
import MyOrders from '@/modules/customer/pages/myorders';
// Các trang dùng lazy load
const Dashboard = Loadable(lazy(() => import('@/mantisAdmin/pages/dashboard/default')));

// Object route theo cấu trúc Dashboard
const CustomerRoutes = {
    path: 'customer',
    element: <ProtectedRoute allowedRoles={['customer']} />,
    children: [
        {
            element: <DashboardLayout />,
            children: [
                {
                    path: '',
                    element: <MyOrders />
                },
                {
                    path: 'create-oder',
                    element: <Checkout />
                },
                {
                    path: 'my-orders',
                    element: <MyOrders />
                },
                {
                    path: 'orders-in-delivery',
                    element: <h1>Hello Orders in delivery</h1>
                },
                {
                    path: 'orders-received',
                    element: <h1>Hello Orders received</h1>
                },
                {
                    path: 'canceled-orders',
                    element: <h1>Hello Canceled orders</h1>
                },
                {
                    path: 'order-history',
                    element: <h1>Hello Order history</h1>
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

export default [CustomerRoutes];
