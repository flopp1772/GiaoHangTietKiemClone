// assets
import { PersonOutline, StarOutline, AttachMoneyOutlined, CalendarTodayOutlined } from '@mui/icons-material';

// icons
const icons = {
    PersonOutline,
    StarOutline,
    AttachMoneyOutlined,
    CalendarTodayOutlined,
};

const shipperProfile = {
    id: 'shipper-profile',
    title: 'Personal Information',
    type: 'group',
    children: [
        {
            id: 'profile-basic',
            title: 'Basic Information',
            type: 'item',
            url: '/shipper/profile/basic',
            icon: icons.PersonOutline,
        },
        {
            id: 'customer-reviews',
            title: 'Customer Reviews',
            type: 'item',
            url: '/shipper/profile/reviews',
            icon: icons.StarOutline,
        },
        {
            id: 'shipper-income',
            title: 'Income',
            type: 'item',
            url: '/shipper/profile/income',
            icon: icons.AttachMoneyOutlined,
        },
        {
            id: 'work-schedule',
            title: 'Work Schedule',
            type: 'item',
            url: '/shipper/profile/schedule',
            icon: icons.CalendarTodayOutlined,
        }
    ]
};

export default shipperProfile; 