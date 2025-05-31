// assets
// import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';
import { ListAltOutlined, LocalShippingOutlined, CheckCircleOutlined, CancelOutlined, HistoryOutlined } from '@mui/icons-material';

// icons
const icons = {
  ListAltOutlined,
  LocalShippingOutlined,
  CheckCircleOutlined,
  CancelOutlined,
  HistoryOutlined
};

// ==============================|| MENU ITEMS - MY ORDERS ||============================== //

const customerOrders = {
  id: 'my-orders-group',
  title: 'My Orders',
  type: 'group',
  children: [
    {
      id: 'my-orders',
      title: 'My Orders',
      type: 'item',
      url: '/customer/my-orders',
      icon: icons.ListAltOutlined,
      target: false // Assuming these links are within the app
    },
    {
      id: 'orders-in-delivery',
      title: 'Orders in Delivery',
      type: 'item',
      url: '/customer/orders-in-delivery',
      icon: icons.LocalShippingOutlined,
      target: false
    },
    {
      id: 'orders-received',
      title: 'Orders Received',
      type: 'item',
      url: '/customer/orders-received',
      icon: icons.CheckCircleOutlined,
      target: false
    },
    {
      id: 'canceled-orders',
      title: 'Canceled Orders',
      type: 'item',
      url: '/customer/canceled-orders',
      icon: icons.CancelOutlined,
      target: false
    },
    {
      id: 'order-history',
      title: 'Order History',
      type: 'item',
      url: '/customer/order-history',
      icon: icons.HistoryOutlined,
      target: false
    }
  ]
};

export default customerOrders;
