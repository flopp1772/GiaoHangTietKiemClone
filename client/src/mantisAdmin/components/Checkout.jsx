import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddressForm from './checkout/AddressForm';
import Info from './checkout/Info';
import InfoMobile from './checkout/InfoMobile';
import Review from './checkout/Review';
import SitemarkIcon from './checkout/SitemarkIcon';
import AppTheme from './checkout/shared-theme/AppTheme';
import ColorModeIconDropdown from './checkout/shared-theme/ColorModeIconDropdown';
import ProductForm from './checkout/createPage';
import { useDispatch, useSelector } from 'react-redux';
import { calculateOrderShippingFee, createOrder } from "@/redux/orders/ordersThunk";
import { setOrderFormField, resetOrderForm, setOrderShippingAddressField } from '@/redux/orders/ordersSlice';
import { useNavigate } from 'react-router-dom';
const steps = ['Shipping address', 'Product info', 'Review your order'];
function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <ProductForm />;
    case 2:
      return <Review />;
    default:
      throw new Error('Unknown step');
  }
}
// Định dạng tiền (VND)
function formatCurrency(amount) {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

export default function Checkout(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderForm = useSelector((state) => state.orders.form);
  const [activeStep, setActiveStep] = React.useState(0);
  const [shippingCostData, setShippingCostData] = React.useState(null);
  const [createdOrder, setCreatedOrder] = React.useState(null);

  const handleNext = async () => {
    if (activeStep === 0) {
      // Bước 0: Gọi API, chỉ set state, không dispatch lên Redux
      const shippingPayload = {
        receiverAddress: orderForm.shippingAddress,
        productInfo: {
          weight: orderForm.weight,
          quantity: orderForm.quantity,
        }
      };
      const resultAction = await dispatch(calculateOrderShippingFee(shippingPayload));
      if (calculateOrderShippingFee.fulfilled.match(resultAction)) {
        setShippingCostData(resultAction.payload);
        // Không dispatch lên Redux ở bước này
        setActiveStep(activeStep + 1);
      } else {
        alert('Failed to calculate shipping cost: ' + resultAction.payload);
      }
    } else if (activeStep === 1) {
      // Bước 1: Gọi lại API (hoặc dùng shippingCostData), dispatch lên Redux
      const shippingPayload = {
        receiverAddress: orderForm.shippingAddress,
        productInfo: {
          weight: orderForm.weight,
          quantity: orderForm.quantity,
        }
      };
      const resultAction = await dispatch(calculateOrderShippingFee(shippingPayload));
      if (calculateOrderShippingFee.fulfilled.match(resultAction)) {
        setShippingCostData(resultAction.payload);
        dispatch(setOrderFormField({ field: 'shippingFee', value: resultAction.payload.totalCost || 0 }));
        dispatch(setOrderShippingAddressField({ field: 'receiverCoords', value: resultAction.payload.receiverCoords || null }));
        setActiveStep(activeStep + 1);
      } else {
        alert('Failed to calculate shipping cost: ' + resultAction.payload);
      }
    } else if (activeStep === 2) {
      // Bước 2: tạo đơn hàng
      try {
        const orderData = {
          ...orderForm,
          weight: Number(orderForm.weight),
          quantity: Number(orderForm.quantity),
        };
        console.log('[DEBUG] orderData gửi lên server:', orderData); // Thêm dòng này
        const resultAction = await dispatch(createOrder(orderData));
        if (createOrder.fulfilled.match(resultAction)) {
          setCreatedOrder(resultAction.payload);
          alert('Tạo đơn hàng thành công!');
          setActiveStep(activeStep + 1);
        } else {
          alert('Tạo đơn hàng thất bại: ' + resultAction.payload);
        }
      } catch (error) {
        alert('Lỗi khi tạo đơn hàng: ' + error.message);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ position: 'fixed', top: '1rem', right: '1rem' }}>
        <ColorModeIconDropdown />
      </Box>

      <Grid
        container
        sx={{
          height: {
            xs: '100%',
            sm: 'calc(100dvh - var(--template-frame-height, 0px))',
          },
          mt: {
            xs: 4,
            sm: 0,
          },
        }}
      >
        <Grid
          size={{ sm: 12, md: 7, lg: 8 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            width: '100%',
            backgroundColor: { xs: 'transparent', sm: 'background.default' },
            alignItems: 'start',
            pt: { xs: 0, sm: 16 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: { sm: 'space-between', md: 'flex-end' },
              alignItems: 'center',
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexGrow: 1,
              }}
            >
              <Stepper
                id="desktop-stepper"
                activeStep={activeStep}
                sx={{ width: '100%', height: 40 }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{ ':first-of-type': { pl: 0 }, ':last-of-type': { pr: 0 } }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
          <Card sx={{ display: { xs: 'flex', md: 'none' }, width: '100%' }}>
            <CardContent
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Selected products
                </Typography>
                <Typography variant="body1">
                  {activeStep >= 2 ? '$144.97' : '$134.98'}
                </Typography>
              </div>
              <InfoMobile totalPrice={activeStep >= 2 ? '$144.97' : '$134.98'} />
            </CardContent>
          </Card>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
              maxHeight: '720px',
              gap: { xs: 5, md: 'none' },
            }}
          >
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{ display: { sm: 'flex', md: 'none' } }}
            >
              {steps.map((label) => (
                <Step
                  sx={{
                    ':first-of-type': { pl: 0 },
                    ':last-of-type': { pr: 0 },
                    '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
                  }}
                  key={label}
                >
                  <StepLabel
                    sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <Stack spacing={2} useFlexGap>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">Thank you for your order!</Typography>
                {createdOrder && createdOrder.shipments && createdOrder.shipments.length > 0 && (
                  <React.Fragment>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      <strong>Mã vận đơn:</strong> {createdOrder.shipments[0].trackingNumber}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      <strong>Trạng thái:</strong> {createdOrder.shipments[0].currentStatus}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      <strong>Ngày giao dự kiến:</strong> {new Date(createdOrder.shipments[0].deliveryDate).toLocaleDateString('vi-VN')}
                    </Typography>
                  </React.Fragment>
                )}
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Your order number is
                  <strong>&nbsp;#{createdOrder ? createdOrder.id : '...'} </strong>
                  . We will update you once its shipped.
                </Typography>
                <Button
                  variant="outline"
                  sx={{
                    alignSelf: 'start', width: { xs: '100%', sm: 'auto' },
                    backgroundColor: 'background.button',
                  }}
                  onClick={() => {
                    dispatch(resetOrderForm());
                    navigate('/customer/my-orders');
                  }}
                >
                  Go to my orders
                </Button>
              </Stack>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box
                  sx={[
                    {
                      display: 'flex',
                      flexDirection: { xs: 'column-reverse', sm: 'row' },
                      alignItems: 'end',
                      flexGrow: 1,
                      gap: 1,
                      pb: { xs: 12, sm: 0 },
                      mt: { xs: 2, sm: 0 },
                      mb: '60px',
                    },
                    activeStep !== 0
                      ? { justifyContent: 'space-between' }
                      : { justifyContent: 'flex-end' },
                  ]}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{ display: { xs: 'none', sm: 'flex' } }}
                    >
                      Previous
                    </Button>
                  )}
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="outlined"
                      fullWidth
                      sx={{ display: { xs: 'flex', sm: 'none' } }}
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    endIcon={<ChevronRightRoundedIcon />}
                    onClick={handleNext}
                    sx={{
                      width: { xs: '100%', sm: 'fit-content' },
                      backgroundColor: 'background.button',
                    }}
                  >
                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 5, lg: 4 }}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            borderRight: { sm: 'none', md: '1px solid' },
            borderColor: { sm: 'none', md: 'divider' },
            alignItems: 'start',
            pt: 16,
            px: 10,
            gap: 4,
          }}
        >
          <SitemarkIcon />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: 500,
            }}
          >
            <Info shippingCostData={shippingCostData} />
          </Box>
        </Grid>
      </Grid>
    </AppTheme>
  );
}
