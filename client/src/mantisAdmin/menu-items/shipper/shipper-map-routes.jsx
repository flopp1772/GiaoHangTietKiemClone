// assets
import { MapOutlined, RouteOutlined } from '@mui/icons-material';

// icons
const icons = {
    MapOutlined,
    RouteOutlined,
};

const shipperMapRoutes = {
    id: 'map-routes',
    title: 'Maps & Routes',
    type: 'group',
    children: [
        {
            id: 'view-on-map',
            title: 'View Orders on Map',
            type: 'item',
            url: '/shipper/map/view', // Placeholder URL
            icon: icons.MapOutlined,
        },
        {
            id: 'optimize-route',
            title: 'Optimize Route',
            type: 'item',
            url: '/shipper/map/optimize', // Placeholder URL
            icon: icons.RouteOutlined,
        },
        {
            id: 'delivery-area',
            title: 'Delivery Area',
            type: 'item',
            url: '/shipper/map/area', // Placeholder URL
            icon: icons.MapOutlined,
        }
    ]
};

export default shipperMapRoutes; 