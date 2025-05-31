import authRoutes from '@/modules/auth/routes';
import introRoutes from '@/modules/intro/routes';
import AdminRoutes from '@/modules/admin/routes';
import CustomerRoutes from '@/modules/customer/routes';
import shipperRoutes from '@/modules/staff/routes';

const routes = [
    ...authRoutes,
    ...introRoutes,
    ...AdminRoutes,
    ...CustomerRoutes,
    ...shipperRoutes,
];

export default routes;