// assets
import { PersonOutline, LocalShippingOutlined, PaymentOutlined } from '@mui/icons-material';

// icons
const icons = {
    PersonOutline,
    LocalShippingOutlined,
    PaymentOutlined,
};

// ==============================|| MENU ITEMS - CUSTOMER INFO ||============================== //

const customerProfile = {
    id: 'customer-info',
    title: 'Customer Info',
    type: 'group',
    allowedRoles: ['customer'], // Chỉ customer mới thấy nhóm này

    children: [
        {
            id: 'my-profile',
            title: 'Personal Information',
            type: 'collapse',
            icon: icons.PersonOutline,
            allowedRoles: ['customer'],
            children: [
                {
                    id: 'profile-basic',
                    title: 'Basic Information',
                    type: 'item',
                    url: '/customer/profile/basic', // URL ví dụ
                    allowedRoles: ['customer'],
                    icon: icons.PersonOutline,
                },
                {
                    id: 'profile-addresses',
                    title: 'Shipping Address',
                    type: 'item',
                    url: '/customer/profile/addresses', // URL ví dụ
                    allowedRoles: ['customer'],
                    icon: icons.LocalShippingOutlined,
                },
                {
                    id: 'profile-payments',
                    title: 'Payment Methods',
                    type: 'item',
                    url: '/customer/profile/payments', // URL ví dụ
                    allowedRoles: ['customer'],
                    icon: icons.PaymentOutlined,
                }
            ]
        },
    ]
};

export default customerProfile; 