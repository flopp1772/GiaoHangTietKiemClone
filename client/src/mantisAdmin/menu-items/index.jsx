import { useSelector } from 'react-redux';
import adminCustomers from './admin/admin-customers';
import adminOrders from './admin/admin-orders';
import adminUsers from './admin/admin-users';
import adminShippers from './admin/admin-shippers';

import shipperMapRoutes from './shipper/shipper-map-routes';
import shipperOrders from './shipper/shipper-orders';
import shipperProfile from './shipper/shipper-profile';

import customerTrackorder from './customer/customer-track-order';
import customerOrders from './customer/customer-orders';
import customerReviewsfeedback from './customer/customer-reviews-feedback';
import customerProfile from './customer/customer-profile';

// ==============================|| MENU ITEMS ||============================== //

// Cache menu items by role
const menuItemsByRole = {
  admin: [adminOrders, adminCustomers, adminShippers, adminUsers],
  shipper: [shipperOrders, shipperMapRoutes, shipperProfile],
  customer: [customerOrders, customerTrackorder, customerProfile, customerReviewsfeedback]
};

// Memoize menu items
const getMenuItemsByRole = (role) => menuItemsByRole[role] || [];

// Export một function để lấy menu items
export const useMenuItems = () => {
  const user = useSelector((state) => state.auth.user);

  // Chỉ tính toán lại khi user hoặc role thay đổi
  const items = user ? getMenuItemsByRole(user.role) : [];

  return {
    items
  };
};

// Export default object với items rỗng
export default { items: [] };
