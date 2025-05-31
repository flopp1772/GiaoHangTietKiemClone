import * as React from 'react';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

export default function Review() {
  const orderForm = useSelector((state) => state.orders.form);

  // Lấy thông tin từ Redux
  const productName = orderForm.productName?.trim() || 'Chưa nhập tên sản phẩm';
  const quantity = orderForm.quantity || 1;
  const weight = orderForm.weight || 1;
  const shippingFee = orderForm.shippingFee || 0;
  const recipientName = orderForm.recipientName || '';
  const shippingAddress = orderForm.shippingAddress || {};
  const addressString = [
    shippingAddress.addressDetail,
    shippingAddress.ward,
    shippingAddress.district,
    shippingAddress.province,
    shippingAddress.zip
  ].filter(Boolean).join(', ');

  // Nếu chỉ muốn hiển thị phí ship
  const total = shippingFee;

  return (
    <Stack spacing={2}>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={productName} secondary={`x${quantity} - ${weight}kg`} />
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" />
          <Typography variant="body2">{shippingFee.toLocaleString('vi-VN')}₫</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {total.toLocaleString('vi-VN')}₫
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack direction="column" divider={<Divider flexItem />} spacing={2} sx={{ my: 2 }}>
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Shipment details
          </Typography>
          <Typography gutterBottom>{recipientName}</Typography>
          <Typography gutterBottom sx={{ color: 'text.secondary' }}>
            {addressString}
          </Typography>
        </div>
      </Stack>
    </Stack>
  );
}
