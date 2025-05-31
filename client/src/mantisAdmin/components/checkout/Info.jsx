import * as React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

function Info({ shippingCostData }) {
  const formatVND = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);

  // Lấy thông tin sản phẩm từ Redux
  const orderForm = useSelector((state) => state.orders.form);
  const productName = orderForm.productName || 'Sản phẩm';
  const quantity = orderForm.quantity || 1;
  const weight = orderForm.weight || 1;

  // Nếu không có dữ liệu thì gán mặc định tất cả bằng 0
  const {
    totalCost = 0,
    breakdown: {
      baseCost = 0,
      distanceCost = 0,
      weightCost = 0,
    } = {},
  } = shippingCostData || {};

  const items = [
    { name: 'Tên sản phẩm', value: productName },
    { name: 'Số lượng', value: quantity },
    { name: 'Cân nặng', value: weight + ' kg' },
    { name: 'Phí cơ bản', value: formatVND(baseCost) },
    { name: 'Phí khoảng cách', value: formatVND(distanceCost) },
    { name: 'Phí trọng lượng', value: formatVND(weightCost) },
  ];

  return (
    <React.Fragment>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Tổng cộng (phí ship)
      </Typography>
      <Typography variant="h4" gutterBottom>
        {formatVND(totalCost)}
      </Typography>
      <List disablePadding>
        {items.map((item) => (
          <ListItem key={item.name} sx={{ py: 1, px: 0 }}>
            <ListItemText sx={{ mr: 2 }} primary={item.name} />
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {item.value}
            </Typography>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
}

Info.propTypes = {
  shippingCostData: PropTypes.shape({
    totalCost: PropTypes.number.isRequired,
    breakdown: PropTypes.shape({
      baseCost: PropTypes.number.isRequired,
      distanceCost: PropTypes.number.isRequired,
      weightCost: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Info;
