// assets
import { LocalShippingOutlined, HistoryOutlined } from '@mui/icons-material';

// icons
const icons = {
    LocalShippingOutlined,
    HistoryOutlined,
};

const shipperOrders = {
    id: 'shipper-orders',
    title: 'My Orders',
    type: 'group',
    children: [
        {
            id: 'orders-delivering',
            title: 'My Tasks',
            type: 'item',
            url: '/shipper/tasks',
            icon: icons.LocalShippingOutlined,
        },
        {
            id: 'orders-completed',
            title: 'Completed Orders',
            type: 'item',
            url: '/shipper/orders/completed',
            icon: icons.HistoryOutlined,
        },
        {
            id: 'orders-cancelled',
            title: 'Cancelled Orders',
            type: 'item',
            url: '/shipper/orders/cancelled',
            icon: icons.LocalShippingOutlined,
        },
        {
            id: 'delivery-history',
            title: 'Delivery History',
            type: 'item',
            url: '/shipper/delivery/history',
            icon: icons.HistoryOutlined,
        }
    ]
};

export default shipperOrders; 