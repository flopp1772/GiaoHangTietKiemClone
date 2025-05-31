import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
import { setOrderFormField } from '@/redux/orders/ordersSlice';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

// Thêm styled component cho phần upload
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Validation rules
const validationRules = {
  productName: (value) => !value.trim() ? 'Product name is required' : '',
  description: (value) => !value.trim() ? 'Product description is required' : '',
  weight: (value) => !value || value <= 0 ? 'Weight must be greater than 0' : '',
  quantity: (value) => {
    if (!value || value <= 0) return 'Quantity must be greater than 0';
    if (!Number.isInteger(Number(value))) return 'Quantity must be an integer';
    return '';
  },
  image: (file) => {
    if (!file) return '';
    if (!file.type.startsWith('image/')) return 'Please select an image file';
    if (file.size > 5 * 1024 * 1024) return 'Image size must not exceed 5MB';
    return '';
  },
};

export default function ProductForm() {
  const dispatch = useDispatch();
  const orderForm = useSelector((state) => state.orders.form);

  const [formState, setFormState] = useState({
    values: {
      productName: orderForm.productName || '',
      description: '',
      weight: orderForm.weight || '',
      quantity: orderForm.quantity || '',
      unit: 'kg',
      image: null
    },
    errors: {},
    previewUrl: ''
  });

  const updateFormState = useCallback((field, value) => {
    setFormState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      errors: { ...prev.errors, [field]: '' }
    }));
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    updateFormState(name, value);

    // Luôn dispatch vào Redux, kể cả khi rỗng hoặc 0
    if (name === 'productName' || name === 'weight' || name === 'quantity') {
      dispatch(setOrderFormField({ field: name, value: value }));
    }
  }, [updateFormState, dispatch]);

  const handleImageChange = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const error = validationRules.image(file);
    if (error) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, image: error }
      }));
      return;
    }

    updateFormState('image', file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormState(prev => ({ ...prev, previewUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  }, [updateFormState]);

  const validationErrors = useMemo(() => {
    return Object.entries(formState.values).reduce((acc, [key, value]) => {
      const error = validationRules[key]?.(value);
      if (error) acc[key] = error;
      return acc;
    }, {});
  }, [formState.values]);

  return (
    <Grid container spacing={3}>
      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="productName" required>
          Product Name
        </FormLabel>
        <OutlinedInput
          id="productName"
          name="productName"
          type="text"
          placeholder="Enter product name"
          autoComplete="off"
          required
          size="small"
          value={formState.values.productName}
          onChange={handleChange}
          error={!!formState.errors.productName}
          aria-describedby="productName-error"
        />
        {formState.errors.productName && (
          <Alert severity="error" id="productName-error" sx={{ mt: 1 }}>
            {formState.errors.productName}
          </Alert>
        )}
      </FormGrid>

      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="description" required>
          Product Description
        </FormLabel>
        <OutlinedInput
          id="description"
          name="description"
          type="text"
          placeholder="Enter product description"
          autoComplete="off"
          required
          size="small"
          value={formState.values.description}
          onChange={handleChange}
          error={!!formState.errors.description}
          aria-describedby="description-error"
        />
        {formState.errors.description && (
          <Alert severity="error" id="description-error" sx={{ mt: 1 }}>
            {formState.errors.description}
          </Alert>
        )}
      </FormGrid>

      <FormGrid size={{ xs: 12, md: 4 }}>
        <FormLabel htmlFor="quantity" required>
          Quantity
        </FormLabel>
        <OutlinedInput
          id="quantity"
          name="quantity"
          type="number"
          placeholder="Enter quantity"
          autoComplete="off"
          required
          size="small"
          value={formState.values.quantity}
          onChange={handleChange}
          error={!!formState.errors.quantity}
          aria-describedby="quantity-error"
        />
        {formState.errors.quantity && (
          <Alert severity="error" id="quantity-error" sx={{ mt: 1 }}>
            {formState.errors.quantity}
          </Alert>
        )}
      </FormGrid>

      <FormGrid size={{ xs: 12, md: 5 }}>
        <FormLabel htmlFor="weight" required>
          Weight
        </FormLabel>
        <OutlinedInput
          id="weight"
          name="weight"
          type="number"
          placeholder="Enter weight"
          autoComplete="off"
          required
          size="small"
          value={formState.values.weight}
          onChange={handleChange}
          error={!!formState.errors.weight}
          aria-describedby="weight-error"
        />
        {formState.errors.weight && (
          <Alert severity="error" id="weight-error" sx={{ mt: 1 }}>
            {formState.errors.weight}
          </Alert>
        )}
      </FormGrid>

      <FormGrid size={{ xs: 12, md: 3 }}>
        <FormLabel htmlFor="unit" required>
          Unit
        </FormLabel>
        <FormControl fullWidth sx={{ backgroundColor: 'white' }}>
          <Select
            id="unit"
            name="unit"
            value={formState.values.unit}
            onChange={handleChange}
            size="small"
          >
            <MenuItem value="kg">Kilogram (kg)</MenuItem>
            <MenuItem value="g">Gram (g)</MenuItem>
            <MenuItem value="t">Ton (t)</MenuItem>
          </Select>
        </FormControl>
      </FormGrid>

      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="image" required>
          Product Image
        </FormLabel>
        <Box
          sx={{
            position: 'relative',
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            width: '100%',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
        >
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          {formState.previewUrl ? (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& img': {
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                },
              }}
            >
              <label htmlFor="image" style={{ width: '100%', height: '100%', cursor: 'pointer' }}>
                <img
                  src={formState.previewUrl}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  <Typography variant="body1" color="white">
                    Click to change image
                  </Typography>
                </Box>
              </label>
            </Box>
          ) : (
            <label htmlFor="image">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="body1">
                  Upload Image
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PNG, JPG or JPEG (max 5MB)
                </Typography>
              </Box>
            </label>
          )}
          {formState.errors.image && (
            <Alert
              severity="error"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                margin: 0,
              }}
            >
              {formState.errors.image}
            </Alert>
          )}
        </Box>
      </FormGrid>
    </Grid>
  );
}
