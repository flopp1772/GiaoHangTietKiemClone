import React from 'react';
import { useEffect, useState } from 'react';
import {
    Box, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Stack, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import MainCard from '@/mantisAdmin/components/MainCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/redux/user/usersThunk';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';

const UserStatus = ({ status }) => {
    const colors = {
        ACTIVE: 'success.main',
        INACTIVE: 'error.main',
        PENDING: 'warning.main'
    };
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, bgcolor: colors[status] || 'grey.500', borderRadius: '50%' }} />
            <Typography sx={{ color: colors[status] || 'text.primary' }}>{status}</Typography>
        </Stack>
    );
};

const AddressDetails = ({ address }) => (
    <Box sx={{
        p: 2,
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
        borderBottom: '1px solid #e0e0e0'
    }}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Địa chỉ:</Typography>
                <Typography>Địa chỉ chi tiết: {address.addressDetail}</Typography>
                <Typography>Quận/Huyện: {address.district}</Typography>
                <Typography>Phường/Xã: {address.ward}</Typography>
                <Typography>Tỉnh/Thành phố: {address.province}</Typography>
                <Typography>Mã bưu điện: {address.postalCode}</Typography>
            </Grid>
        </Grid>
    </Box>
);

// Thêm mảng roles
const ROLES = ['admin', 'shipper', 'customer'];

export default function ManageUsers() {
    const dispatch = useDispatch();
    const users = useSelector(state => (state.users && Array.isArray(state.users.list) ? state.users.list : []));
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);
    useEffect(() => {
        console.log('Users from redux:', users);
    }, [users]);

    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        store_name: '',
        email: '',
        phone: '',
        password: '',
        role: '',
        address_detail: '',
        province: '',
        district: '',
        ward: ''
    });
    // Filter state
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchRole, setSearchRole] = useState('');
    const [searchStatus, setSearchStatus] = useState('');

    // Filtered users
    const filteredUsers = users.filter(row =>
        (!searchName || (row.store_name && row.store_name.toLowerCase().includes(searchName.toLowerCase()))) &&
        (!searchEmail || (row.email && row.email.toLowerCase().includes(searchEmail.toLowerCase()))) &&
        (!searchRole || (row.role && row.role.toLowerCase().includes(searchRole.toLowerCase()))) &&
        (!searchStatus || (row.status && row.status.toLowerCase().includes(searchStatus.toLowerCase())))
    );

    const [expandedRow, setExpandedRow] = useState(null);

    const handleOpenDialog = (user = null) => {
        setEditingUser(user);
        if (user && user.addresses && user.addresses.length > 0) {
            const address = user.addresses[0];
            setFormData({
                store_name: user.store_name || '',
                email: user.email || '',
                phone: user.phone || '',
                password: '',
                role: user.role || '',
                address_detail: address.addressDetail || '',
                province: address.province || '',
                district: address.district || '',
                ward: address.ward || ''
            });
        } else {
            setFormData({
                store_name: '',
                email: '',
                phone: '',
                password: '',
                role: '',
                address_detail: '',
                province: '',
                district: '',
                ward: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingUser(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Validate form data
        if (!formData.store_name || !formData.email || !formData.phone || !formData.role) {
            alert('Please fill in all required fields');
            return;
        }

        if (!editingUser && !formData.password) {
            alert('Password is required for new users');
            return;
        }

        console.log('Form data before save:', formData);

        if (editingUser) {
            dispatch(updateUser({ id: editingUser.id, data: formData }))
                .unwrap()
                .then((response) => {
                    console.log('User updated successfully:', response);
                    handleCloseDialog();
                })
                .catch((error) => {
                    console.error('Failed to update user:', error);
                    alert(error || 'Failed to update user');
                });
        } else {
            dispatch(createUser(formData))
                .unwrap()
                .then((response) => {
                    console.log('User created successfully:', response);
                    handleCloseDialog();
                })
                .catch((error) => {
                    console.error('Failed to create user:', error);
                    alert(error || 'Failed to create user');
                });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(id))
                .unwrap()
                .then((response) => {
                    console.log('User deleted successfully:', response);
                    // Không cần làm gì thêm vì redux sẽ tự cập nhật state
                })
                .catch((error) => {
                    console.error('Failed to delete user:', error);
                    alert(error || 'Failed to delete user');
                });
        }
    };

    return (
        <Grid item xs={12} md={7} lg={8}>
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Grid>
                    <Typography variant="h5">Manage Users</Typography>
                </Grid>
                <Grid>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                        Add User
                    </Button>
                </Grid>
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
                <Box sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <input
                                type="text"
                                placeholder="Search Name"
                                value={searchName}
                                onChange={e => setSearchName(e.target.value)}
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <input
                                type="text"
                                placeholder="Search Email"
                                value={searchEmail}
                                onChange={e => setSearchEmail(e.target.value)}
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <input
                                type="text"
                                placeholder="Search Role"
                                value={searchRole}
                                onChange={e => setSearchRole(e.target.value)}
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <input
                                type="text"
                                placeholder="Search Status"
                                value={searchStatus}
                                onChange={e => setSearchStatus(e.target.value)}
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <TableContainer
                        sx={{
                            width: '100%',
                            overflowX: 'auto',
                            overflowY: 'auto',
                            maxHeight: 700,
                            position: 'relative',
                            display: 'block',
                            maxWidth: '100%',
                            '& td, & th': { whiteSpace: 'nowrap' }
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map((row, index) => (
                                    <React.Fragment key={row.id || index}>
                                        <TableRow
                                            hover
                                            onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                                            sx={{
                                                cursor: 'pointer',
                                                backgroundColor: expandedRow === index ? '#f5f5f5' : 'inherit',
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5'
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                {expandedRow === index ? (
                                                    <KeyboardArrowUpIcon fontSize="small" />
                                                ) : (
                                                    <KeyboardArrowDownIcon fontSize="small" />
                                                )}
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>{row.store_name}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.role}</TableCell>
                                            <TableCell>{row.phone}</TableCell>
                                            <TableCell>
                                                <UserStatus status={row.status} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton color="primary" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenDialog(row);
                                                }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton color="error" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(row.id);
                                                }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={7} style={{ padding: 0 }}>
                                                <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                                                    {row.addresses && row.addresses.length > 0 ? (
                                                        <AddressDetails address={row.addresses[0]} />
                                                    ) : (
                                                        <Box sx={{ p: 2, textAlign: 'center' }}>
                                                            <Typography>Không có thông tin địa chỉ</Typography>
                                                        </Box>
                                                    )}
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </MainCard>
            {/* Modal */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Store Name"
                        name="store_name"
                        value={formData.store_name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                    />
                    {!editingUser && (
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                        />
                    )}
                    <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            label="Role"
                        >
                            {ROLES.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>Address Information</Typography>
                    <TextField
                        label="Address Detail"
                        name="address_detail"
                        value={formData.address_detail}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Province"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="District"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Ward"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>
                        {editingUser ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
