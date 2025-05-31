// assets
import { PeopleOutline, BarChartOutlined, HistoryOutlined } from '@mui/icons-material';

// icons
const icons = {
    PeopleOutline,
    BarChartOutlined,
    HistoryOutlined,
};

const adminCustomers = {
    id: 'admin-customers',
    title: 'Customer Management',
    type: 'group',
    url: '/admin/customers',
    breadcrumbs: true,
    icon: icons.PeopleOutline,
    children: [
        {
            id: 'customer-list',
            title: 'Customer List',
            type: 'item',
            url: '/admin/customers/list',
            breadcrumbs: true,
            icon: icons.PeopleOutline,
        },
        {
            id: 'new-customer-stats',
            title: 'New Customer Statistics',
            type: 'item',
            url: '/admin/customers/new-stats',
            breadcrumbs: true,
            icon: icons.BarChartOutlined,
        },
        {
            id: 'transaction-history',
            title: 'Transaction History',
            type: 'item',
            url: '/admin/customers/history',
            breadcrumbs: true,
            icon: icons.HistoryOutlined,
        }
    ]
};

export default adminCustomers; 