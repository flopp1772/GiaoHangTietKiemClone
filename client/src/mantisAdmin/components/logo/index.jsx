import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';

// component image
import Image from '@/components/image/image';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection({ sx, to }) {
  return (
    <ButtonBase disableRipple component={Link} to={to || '/'} sx={sx}>
      <Image
        path="/general-ghtk/logo.svg"
        alt="GHTK Logo"
        className="logo-img"
        w={190}
        h={48}
      />
    </ButtonBase>
  );
}

LogoSection.propTypes = {
  sx: PropTypes.any,
  to: PropTypes.any
};
