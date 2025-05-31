import { memo, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NavGroup from './NavGroup';
import { useMenuItems } from '../../../../../menu-items';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = memo(() => {
  const { items } = useMenuItems();

  // Memoize navGroups để tránh tính toán lại không cần thiết
  const navGroups = useMemo(() =>
    items.map((item) => {
      switch (item.type) {
        case 'group':
          return <NavGroup key={item.id} item={item} />;
        default:
          return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              Fix - Navigation Group
            </Typography>
          );
      }
    }), [items]);

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
});

Navigation.displayName = 'Navigation';

export default Navigation;