// material-ui
import Box from '@mui/material/Box';

// custom image component
import Image from '@/components/image/image';

// ==============================|| AUTH BACKGROUND IMAGE ||============================== //

export default function AuthBackground() {
  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: -1,
        top: '50%',        // đặt phần tử ở giữa chiều cao viewport
        left: '50%',       // đặt phần tử ở giữa chiều ngang viewport
        width: '100%',
        height: 'calc(100vh - 400px)',
        overflow: 'hidden',
        filter: 'blur(18px)',
        transform: 'translate(-50%, -50%)'  // kéo phần tử lên và sang trái bằng 50% kích thước của nó
      }}
    >
      <Image
        path="/general-ghtk/logo.svg"
        alt="GHTK Logo"
        className="logo-img"
        w={190}
        h={48}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </Box>
  );
}