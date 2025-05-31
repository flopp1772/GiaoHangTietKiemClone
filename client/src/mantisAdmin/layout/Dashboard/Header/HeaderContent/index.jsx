// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Import useSelector from react-redux
import { useSelector } from 'react-redux';

// project imports
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // Read user role from Redux state
  // Assuming the role is stored at state.auth.user.role. Adjust if your state structure is different.
  const role = useSelector(state => state.auth.user.role);

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      width: '100%',
      flexWrap: 'nowrap',
      overflow: 'hidden'
    }}>
      {!downLG && <Search />}

      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      {/* Conditionally render the Button based on user role */}
      {role === 'customer' && (
        <Button
          component={Link}
          href="/customer/create-oder"
          variant="outlined"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            whiteSpace: 'nowrap',
            // Bỏ phần style background vì outlined variant đã xử lý viền và hover mặc định
          }}
        >
          Create Order
        </Button>
      )}

      <Notification />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </Box>
  );
}
