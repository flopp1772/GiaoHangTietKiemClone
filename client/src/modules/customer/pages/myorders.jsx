import PropTypes from 'prop-types';
import React from 'react';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from '@/mantisAdmin/components/MainCard';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '@/redux/orders/ordersThunk';

// third-party
import { NumericFormat } from 'react-number-format';

// project imports
import Dot from '@/mantisAdmin/components/@extended/Dot';
import Grid from '@mui/material/Grid';

function createData(tracking_no, name, fat, carbs, protein) {
    return { tracking_no, name, fat, carbs, protein };
}

const rows = [
    createData(84564564, 'Camera Lens', 40, 2, 40570),
    createData(98764564, 'Laptop', 300, 0, 180139),
    createData(98756325, 'Mobile', 355, 1, 90989),
    createData(98652366, 'Handset', 50, 1, 10239),
    createData(13286564, 'Computer Accessories', 100, 1, 83348),
    createData(86739658, 'TV', 99, 0, 410780),
    createData(13256498, 'Keyboard', 125, 2, 70999),
    createData(98753263, 'Mouse', 89, 2, 10570),
    createData(98753275, 'Desktop', 185, 1, 98063),
    createData(98753291, 'Chair', 100, 0, 14001)
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'id',
        align: 'left',
        disablePadding: false,
        label: 'ID'
    },
    {
        id: 'trackingNo',
        align: 'left',
        disablePadding: false,
        label: 'Tracking No.'
    },
    {
        id: 'recipientName',
        align: 'left',
        disablePadding: false,
        label: 'Recipient Name'
    },
    {
        id: 'productName',
        align: 'left',
        disablePadding: false,
        label: 'Product Name'
    },
    {
        id: 'status',
        align: 'left',
        disablePadding: false,
        label: 'Status'
    },
    {
        id: 'shippingFee',
        align: 'right',
        disablePadding: false,
        label: 'Shipping Fee'
    }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function OrderStatus({ status }) {
    let color = 'primary';
    let title = status;
    let textColor = 'text.primary';

    switch (status) {
        case 'PROCESSING':
            color = 'warning';
            textColor = 'warning.main';
            title = 'Processing';
            break;
        case 'SHIPPING':
            color = 'success';
            textColor = 'success.main';
            title = 'Shipping';
            break;
        case 'DELIVERED':
            color = 'error';
            textColor = 'error.main';
            title = 'Delivered';
            break;
        default:
            color = 'primary';
            textColor = 'primary.main';
            title = status || 'Unknown';
    }

    return (
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
            <Dot color={color} />
            <Typography sx={{ color: textColor }}>{title}</Typography>
        </Stack>
    );
}

// ==============================|| ORDER TABLE ||============================== //

export default function MyOrders() {
    const dispatch = useDispatch();
    const orders = useSelector(state => (state.orders && Array.isArray(state.orders.list) ? state.orders.list : []));
    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);
    useEffect(() => {
        console.log('Orders from redux:', orders);
    }, [orders]);

    // State cho filter
    const [searchTracking, setSearchTracking] = useState('');
    const [searchRecipient, setSearchRecipient] = useState('');
    const [searchProduct, setSearchProduct] = useState('');
    const [searchStatus, setSearchStatus] = useState('');

    // Thêm state để quản lý row đang mở rộng
    const [expandedRow, setExpandedRow] = useState(null);

    // Lọc dữ liệu
    const filteredOrders = orders.filter(row =>
        (!searchTracking || (row.trackingNumber && row.trackingNumber.toLowerCase().includes(searchTracking.toLowerCase()))) &&
        (!searchRecipient || (row.recipientName && row.recipientName.toLowerCase().includes(searchRecipient.toLowerCase()))) &&
        (!searchProduct || (row.productName && row.productName.toLowerCase().includes(searchProduct.toLowerCase()))) &&
        (!searchStatus || (row.status && row.status.toLowerCase().includes(searchStatus.toLowerCase())))
    );

    const order = 'asc';
    const orderBy = 'tracking_no';

    // Thêm component hiển thị chi tiết địa chỉ
    const AddressDetails = ({ address }) => (
        <Box sx={{
            p: 2,
            backgroundColor: '#f5f5f5',
            borderTop: '1px solid #e0e0e0',
            borderBottom: '1px solid #e0e0e0'
        }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Địa chỉ người nhận:</Typography>
                    <Typography>Địa chỉ: {address.addressDetail}</Typography>
                    <Typography>Quận/Huyện: {address.district}</Typography>
                    <Typography>Phường/Xã: {address.ward}</Typography>
                    <Typography>Tỉnh/Thành phố: {address.province}</Typography>
                    <Typography>Mã bưu điện: {address.postalCode}</Typography>
                </Grid>
            </Grid>
        </Box>
    );

    // Thêm useEffect để debug
    useEffect(() => {
        console.log('Expanded row:', expandedRow);
        console.log('Orders data:', orders);
    }, [expandedRow, orders]);

    return (
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid>
                    <Typography variant="h5">Orders Table</Typography>
                </Grid>
                <Grid />
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
                <Box sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <input
                                type="text"
                                placeholder="Search Tracking No."
                                value={searchTracking}
                                onChange={e => setSearchTracking(e.target.value)}
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <input
                                type="text"
                                placeholder="Search Recipient Name"
                                value={searchRecipient}
                                onChange={e => setSearchRecipient(e.target.value)}
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <input
                                type="text"
                                placeholder="Search Product Name"
                                value={searchProduct}
                                onChange={e => setSearchProduct(e.target.value)}
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
                        <Table aria-labelledby="tableTitle">
                            <OrderTableHead order={order} orderBy={orderBy} />
                            <TableBody>
                                {filteredOrders.map((row, index) => (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        tabIndex={-1}
                                        key={row.trackingNumber || index}
                                    >
                                        <TableCell component="th" scope="row">{index + 1}</TableCell>
                                        <TableCell>{row.trackingNumber}</TableCell>
                                        <TableCell>{row.recipientName}</TableCell>
                                        <TableCell>{row.productName}</TableCell>
                                        <TableCell>
                                            <OrderStatus status={row.status} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <NumericFormat value={row.shippingFee} displayType="text" thousandSeparator />
                                            &nbsp;VND
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </MainCard>
        </Grid>
    );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

OrderStatus.propTypes = { status: PropTypes.string };
