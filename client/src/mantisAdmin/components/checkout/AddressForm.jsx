import * as React from 'react';
import { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from 'sub-vn';
import { useDispatch, useSelector } from 'react-redux';
import { setOrderFormField, setOrderShippingAddressField } from '@/redux/orders/ordersSlice';

// third-party imports
import * as Yup from 'yup';
import { Formik } from 'formik';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

// Component phụ để tự động dispatch values mỗi khi thay đổi
function FormikWatcher({ values, provinceList, districtList, wardList }) {
  const selectedProvince = provinceList.find(p => p.code === values.province);
  const selectedDistrict = districtList.find(d => d.code === values.district);
  const selectedWard = wardList.find(w => w.code === values.ward);

  const dispatch = useDispatch();

  useEffect(() => {
    // Cập nhật các trường vào orderSlice
    dispatch(setOrderFormField({ field: 'recipientName', value: `${values.firstName} ${values.lastName}`.trim() }));
    dispatch(setOrderFormField({ field: 'recipientPhone', value: values.phone }));
    dispatch(setOrderShippingAddressField({ field: 'addressDetail', value: values.address_detail }));
    dispatch(setOrderShippingAddressField({ field: 'province', value: selectedProvince ? selectedProvince.name : '' }));
    dispatch(setOrderShippingAddressField({ field: 'district', value: selectedDistrict ? selectedDistrict.name : '' }));
    dispatch(setOrderShippingAddressField({ field: 'ward', value: selectedWard ? selectedWard.name : '' }));
    dispatch(setOrderShippingAddressField({ field: 'zip', value: values.zip }));
  }, [values, dispatch, selectedProvince, selectedDistrict, selectedWard]);

  return null;
}


export default function AddressForm() {
  // Lấy giá trị form hiện tại từ redux (ordshipping)
  const orderForm = useSelector(state => state.orders.form);

  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  // Di chuyển useEffect này vào component
  useEffect(() => {
    const provincesData = getProvinces();
    setProvinceList(provincesData);
  }, []);

  return (
    <Formik
      initialValues={{
        firstName: orderForm?.recipientName?.split(' ')?.slice(0, -1).join(' ') || '',
        lastName: orderForm?.recipientName?.split(' ')?.slice(-1).join(' ') || '',
        phone: orderForm?.recipientPhone || '',
        address_detail: orderForm?.shippingAddress?.addressDetail || '',
        province: '',
        district: '',
        ward: '',
        zip: orderForm?.shippingAddress?.zip || '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        phone: Yup.string()
          .matches(/^[0-9]{10,11}$/, 'Phone number is not valid')
          .required('Phone is required'),
        address_detail: Yup.string().required('Address detail is required'),
        province: Yup.string().required('Province is required'),
        district: Yup.string().required('District is required'),
        ward: Yup.string().required('Ward is required'),
        zip: Yup.string().required('Zip code is required')
      })}
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
        }, [values.province, setFieldValue]);

        useEffect(() => {
          if (values.district) {
            const wardsData = getWardsByDistrictCode(values.district);
            setWardList(wardsData);
            setFieldValue('ward', '');
          } else {
            setWardList([]);
            setFieldValue('ward', '');
          }
        }, [values.district, setFieldValue]);

        return (
          <>
            {/* FormikWatcher nằm ở đây để watch form values và dispatch */}
            <FormikWatcher
              values={values}
              provinceList={provinceList}
              districtList={districtList}
              wardList={wardList}
            />

            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* ... phần form giữ nguyên như bạn gửi ... */}
                {/* copy nguyên phần form từ trên bạn gửi vào đây */}
                <FormGrid size={{ xs: 12, md: 6 }}>
                  <FormLabel htmlFor="first-name" required>
                    First name
                  </FormLabel>
                  <OutlinedInput
                    id="first-name"
                    name="firstName"
                    type="text"
                    value={values.firstName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="John"
                    autoComplete="first name"
                    required
                    size="small"
                    error={Boolean(touched.firstName && errors.firstName)}
                  />
                  {touched.firstName && errors.firstName && (
                    <FormHelperText error>{errors.firstName}</FormHelperText>
                  )}
                </FormGrid>

                <FormGrid size={{ xs: 12, md: 6 }}>
                  <FormLabel htmlFor="last-name" required>
                    Last name
                  </FormLabel>
                  <OutlinedInput
                    id="last-name"
                    name="lastName"
                    type="text"
                    value={values.lastName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Snow"
                    autoComplete="last name"
                    required
                    size="small"
                    error={Boolean(touched.lastName && errors.lastName)}
                  />
                  {touched.lastName && errors.lastName && (
                    <FormHelperText error>{errors.lastName}</FormHelperText>
                  )}
                </FormGrid>

                <FormGrid size={{ xs: 12 }}>
                  <FormLabel htmlFor="phone" required>
                    Phone number
                  </FormLabel>
                  <OutlinedInput
                    id="phone"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    required
                    size="small"
                    error={Boolean(touched.phone && errors.phone)}
                  />
                  {touched.phone && errors.phone && (
                    <FormHelperText error>{errors.phone}</FormHelperText>
                  )}
                </FormGrid>

                <FormGrid size={{ xs: 12 }}>
                  <FormLabel htmlFor="address" required>
                    Address detail
                  </FormLabel>
                  <OutlinedInput
                    id="address"
                    name="address_detail"
                    type="text"
                    value={values.address_detail}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    autoComplete="shipping address"
                    required
                    size="small"
                    error={Boolean(touched.address_detail && errors.address_detail)}
                  />
                  {touched.address_detail && errors.address_detail && (
                    <FormHelperText error>{errors.address_detail}</FormHelperText>
                  )}
                </FormGrid>

                <FormGrid size={{ xs: 6 }}>
                  <FormLabel htmlFor="province" required>
                    Province
                  </FormLabel>
                  <FormControl fullWidth sx={{ backgroundColor: 'white' }} error={Boolean(touched.province && errors.province)}>
                    <Select
                      id="province"
                      value={values.province}
                      name="province"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      displayEmpty
                      size="small"
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
                    {touched.province && errors.province && (
                      <FormHelperText error>{errors.province}</FormHelperText>
                    )}
                  </FormControl>
                </FormGrid>

                <FormGrid size={{ xs: 6 }} sx={{ backgroundColor: 'white' }}>
                  <FormLabel htmlFor="district" required>
                    District
                  </FormLabel>
                  <FormControl fullWidth error={Boolean(touched.district && errors.district)}>
                    <Select
                      id="district"
                      value={values.district}
                      name="district"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      displayEmpty
                      size="small"
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
                    {touched.district && errors.district && (
                      <FormHelperText error>{errors.district}</FormHelperText>
                    )}
                  </FormControl>
                </FormGrid>

                <FormGrid size={{ xs: 6 }}>
                  <FormLabel htmlFor="ward" required>
                    Ward
                  </FormLabel>
                  <FormControl fullWidth sx={{ backgroundColor: 'white' }} error={Boolean(touched.ward && errors.ward)}>
                    <Select
                      id="ward"
                      value={values.ward}
                      name="ward"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      displayEmpty
                      size="small"
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
                    {touched.ward && errors.ward && (
                      <FormHelperText error>{errors.ward}</FormHelperText>
                    )}
                  </FormControl>
                </FormGrid>

                <FormGrid size={{ xs: 6 }}>
                  <FormLabel htmlFor="zip" required>
                    Zip / Postal code
                  </FormLabel>
                  <OutlinedInput
                    id="zip"
                    name="zip"
                    type="text"
                    value={values.zip}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="12345"
                    autoComplete="shipping postal-code"
                    required
                    size="small"
                    error={Boolean(touched.zip && errors.zip)}
                  />
                  {touched.zip && errors.zip && (
                    <FormHelperText error>{errors.zip}</FormHelperText>
                  )}
                </FormGrid>

                {errors.submit && (
                  <FormHelperText error sx={{ mt: 2 }}>
                    {errors.submit}
                  </FormHelperText>
                )}

                {/* Có thể thêm nút submit nếu cần */}
                {/* <Button type="submit" variant="contained" disabled={isSubmitting}>Submit</Button> */}

              </Grid>
            </form>
          </>
        );
      }}
    </Formik>
  );
}
