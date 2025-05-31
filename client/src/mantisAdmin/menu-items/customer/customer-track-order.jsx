import { LocationOnOutlined, ListAltOutlined, AccessTimeOutlined } from '@mui/icons-material';

// icons
const icons = {
  LocationOnOutlined,
  ListAltOutlined,
  AccessTimeOutlined,
};

// ==============================|| MENU ITEMS - TRACK ORDER ||============================== //

const customerTrackorder = {
  id: 'track-order-group',
  title: 'Track Order',
  type: 'group',
  children: [
    {
      id: 'track-order-status',
      title: 'Order Status',
      type: 'item',
      url: '/track/status',
      icon: icons.ListAltOutlined // Using ListAltOutlined for order status
    },
    {
      id: 'track-shipper-location',
      title: 'Shipper Location',
      type: 'item',
      url: '/track/shipper',
      icon: icons.LocationOnOutlined // Keeping LocationOnOutlined for shipper location
    },
    {
      id: 'track-estimated-time',
      title: 'Estimated Time',
      type: 'item',
      url: '/track/estimated-time',
      icon: icons.AccessTimeOutlined // Using AccessTimeOutlined for estimated time
    }
  ]
};

export default customerTrackorder;
