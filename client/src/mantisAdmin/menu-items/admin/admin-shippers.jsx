// assets
import { CommuteOutlined, EqualizerOutlined, AssignmentOutlined, StarOutline } from '@mui/icons-material';

// icons
const icons = {
    CommuteOutlined,
    EqualizerOutlined,
    AssignmentOutlined,
    StarOutline,
};

const adminShippers = {
    id: 'admin-shippers',
    title: 'Shipper Management',
    type: 'group',
    children: [
        {
            id: 'shipper-list',
            title: 'Shipper List',
            type: 'item',
            url: '/admin/shippers/list', // Placeholder URL
            icon: icons.CommuteOutlined,
        },
        {
            id: 'shipper-performance',
            title: 'Shipper Performance Statistics',
            type: 'item',
            url: '/admin/shippers/performance', // Placeholder URL
            icon: icons.EqualizerOutlined,
        },
        {
            id: 'assign-orders',
            title: 'Order Assignment',
            type: 'item',
            url: '/admin/shippers/assign', // Placeholder URL
            icon: icons.AssignmentOutlined,
        },
        {
            id: 'shipper-reviews',
            title: 'Shipper Reviews',
            type: 'item',
            url: '/admin/shippers/reviews', // Placeholder URL
            icon: icons.StarOutline,
        }
    ]
};

export default adminShippers; 