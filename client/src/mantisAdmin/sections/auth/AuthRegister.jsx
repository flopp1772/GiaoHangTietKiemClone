import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from 'sub-vn';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from '../../components/@extended/IconButton';
import AnimateButton from '../../components/@extended/AnimateButton';

import { strengthColor, strengthIndicator } from '../../utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {

  const provincesData = getProvinces();

  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth'); // get auth and set route based on that

  useEffect(() => {
    changePassword('');
    setProvinceList(provincesData); // Load initial province list
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          store_name: '',
          email: '',
          phone: '',
          password: '',
          address_detail: '',
          province: '',
          district: '',
          ward: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          store_name: Yup.string().max(255).required('Store Name is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          phone: Yup.string().matches(/^[0-9]{10,11}$/, 'Phone number is not valid').required('Phone is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim()),
          address_detail: Yup.string().required('Address Detail is required'),
          province: Yup.string().required('Province is required'),
          district: Yup.string().required('District is required'),
          ward: Yup.string().required('Ward is required'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
          try {
            console.log('Submitting registration data (raw Formik values):', values);

            // Lấy tỉnh, quận, phường từ mã đã chọn
            const selectedProvince = provinceList.find(p => p.code === values.province);
            const selectedDistrict = districtList.find(d => d.code === values.district);
            const selectedWard = wardList.find(w => w.code === values.ward);

            // Tạo payload để gửi đi
            const payload = {
              store_name: values.store_name,
              email: values.email,
              phone: values.phone,
              password: values.password,
              role: 'customer',  // Fix cứng role là "customer"
              address_detail: values.address_detail,
              province: selectedProvince ? selectedProvince.name : '',
              district: selectedDistrict ? selectedDistrict.name : '',
              ward: selectedWard ? selectedWard.name : '',
            };

            console.log('Submitting payload:', payload);

            // Gửi request đến API
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/auth/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log('Registration response:', data);

            if (response.ok) {
              setStatus({ success: true });
              setSubmitting(false);
              alert('Đăng ký thành công!');
              resetForm();
            } else {
              setStatus({ success: false });
              if (data?.errors) {
                setErrors(data.errors);
              } else {
                setErrors({ submit: data?.message || 'Registration failed' });
              }
              setSubmitting(false);
            }
          } catch (err) {
            console.error('Registration error:', err);
            setStatus({ success: false });
            setErrors({ submit: 'Không thể kết nối với server' });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, touched, values, setFieldValue, isSubmitting, handleSubmit }) => {
          useEffect(() => {
            if (values.province) {
              const districtsData = getDistrictsByProvinceCode(values.province);
              setDistrictList(districtsData);
              setFieldValue('district', '');
              setFieldValue('ward', '');
              setWardList([]);
            } else {
              setDistrictList([]);
              setWardList([]);
              setFieldValue('district', '');
              setFieldValue('ward', '');
            }
          }, [values.province, setFieldValue, provinceList]);

          useEffect(() => {
            if (values.district) {
              const wardsData = getWardsByDistrictCode(values.district);
              setWardList(wardsData);
              setFieldValue('ward', '');
            } else {
              setWardList([]);
              setFieldValue('ward', '');
            }
          }, [values.district, setFieldValue, districtList]);

          return (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="store-name-signup">Store Name*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.store_name && errors.store_name)}
                      id="store-name-signup"
                      value={values.store_name}
                      name="store_name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="My Awesome Store"
                    />
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="phone-signup">Phone*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.phone && errors.phone)}
                      id="phone-signup"
                      value={values.phone}
                      name="phone"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="0123456789"
                    />
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="address-detail-signup">Address Detail*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.address_detail && errors.address_detail)}
                      id="address-detail-signup"
                      value={values.address_detail}
                      name="address_detail"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="House number, street name, etc."
                    />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="province-signup">Province*</InputLabel>
                    <FormControl fullWidth error={Boolean(touched.province && errors.province)}>
                      <Select
                        id="province-signup"
                        value={values.province}
                        name="province"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        displayEmpty
                      >
                        <MenuItem value="">
                          Select Province
                        </MenuItem>
                        {provinceList.map((province) => (
                          <MenuItem key={province.code} value={province.code}>
                            {province.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="district-signup">District*</InputLabel>
                    <FormControl fullWidth error={Boolean(touched.district && errors.district)}>
                      <Select
                        id="district-signup"
                        value={values.district}
                        name="district"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        displayEmpty
                      >
                        <MenuItem value="">
                          Select District
                        </MenuItem>
                        {districtList.map((district) => (
                          <MenuItem key={district.code} value={district.code}>
                            {district.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="ward-signup">Ward*</InputLabel>
                    <FormControl fullWidth error={Boolean(touched.ward && errors.ward)}>
                      <Select
                        id="ward-signup"
                        value={values.ward}
                        name="ward"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        displayEmpty
                      >
                        <MenuItem value="">
                          Select Ward
                        </MenuItem>
                        {wardList.map((ward) => (
                          <MenuItem key={ward.code} value={ward.code}>
                            {ward.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                      id="email-login"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="demo@company.com"
                    />
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="password-signup">Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="password-signup"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        changePassword(e.target.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="secondary"
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder="******"
                    />
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <AnimateButton>
                    <Button fullWidth size="large" variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </>
  );
}
