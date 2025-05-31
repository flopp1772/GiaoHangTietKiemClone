// assets
import { AssessmentOutlined } from '@mui/icons-material';

// icons
const icons = {
    AssessmentOutlined,
};

const adminUsers = {
    id: 'admin-users',
    title: 'Users',
    type: 'group',
    children: [
        {
            id: 'manage-users',
            title: 'Manage Users',
            type: 'item',
            url: '/admin/manage-users',
            icon: icons.AssessmentOutlined,
        }
    ]
};

export default adminUsers; 