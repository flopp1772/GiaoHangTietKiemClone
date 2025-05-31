// assets
import { ShoppingCartOutlined, AddShoppingCartOutlined, HourglassEmptyOutlined, CheckCircleOutline, CancelOutlined } from '@mui/icons-material';

// icons
const icons = {
    ShoppingCartOutlined,
    AddShoppingCartOutlined,
    HourglassEmptyOutlined,
    CheckCircleOutline,
    CancelOutlined,
};

const adminOrders = {
    id: 'admin-orders',
    title: 'Order Management',
    type: 'group',
    children: [
        {
            id: 'total-orders',
            title: 'Total Orders',
            type: 'item',
            url: '/admin/orders/total', // Placeholder URL
            icon: icons.ShoppingCartOutlined,
        },
        {
            id: 'new-orders',
            title: 'New Orders',
            type: 'item',
            url: '/admin/orders/new', // Placeholder URL
            icon: icons.AddShoppingCartOutlined,
        },
        {
            id: 'processing-orders',
            title: 'Processing Orders',
            type: 'item',
            url: '/admin/orders/processing', // Placeholder URL
            icon: icons.HourglassEmptyOutlined,
        },
        {
            id: 'completed-orders',
            title: 'Completed Orders',
            type: 'item',
            url: '/admin/orders/completed', // Placeholder URL
            icon: icons.CheckCircleOutline,
        },
        {
            id: 'cancelled-orders',
            title: 'Cancelled Orders',
            type: 'item',
            url: '/admin/orders/cancelled', // Placeholder URL
            icon: icons.CancelOutlined,
        }
    ]
};

export default adminOrders; 