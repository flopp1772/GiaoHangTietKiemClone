import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Typography, Grid, Modal, Card, CardContent, CardActions,
    TextField, Select, MenuItem, InputLabel, FormControl, Box, IconButton
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import MapIcon from '@mui/icons-material/Map';
import EditNoteIcon from '@mui/icons-material/EditNote';
import InfoIcon from '@mui/icons-material/Info';
import UpdateIcon from '@mui/icons-material/Update';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrder } from '@/redux/orders/ordersThunk';

const statusOptions = [
    { value: 'PROCESSING', label: 'Chờ lấy hàng' },
    { value: 'SHIPPING', label: 'Đang giao' },
    { value: 'DELIVERED', label: 'Đã giao' },
];

function formatAddress(addr) {
    if (!addr) return '';
    return `${addr.addressDetail}, ${addr.ward}, ${addr.district}, ${addr.province}`;
}

function formatCurrency(amount) {
    return amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '';
}

const TaskDetailModal = ({ open, onClose, task, onUpdateStatus, onAddNote }) => {
    const [status, setStatus] = useState(task?.status || '');
    const [note, setNote] = useState(task?.note || '');

    React.useEffect(() => {
        setStatus(task?.status || '');
        setNote(task?.note || '');
    }, [task]);

    if (!task) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 400, bgcolor: 'background.paper', boxShadow: 24, borderRadius: 2, p: 3
            }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Chi tiết đơn hàng</Typography>
                <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="subtitle2">Mã vận đơn: <b>{task.trackingNumber}</b></Typography>
                        <Typography variant="body2">Trạng thái: <b>{statusOptions.find(s => s.value === status)?.label || status}</b></Typography>
                        <Typography variant="body2">Ngày lấy hàng: {task.pickupDate}</Typography>
                        <Typography variant="body2">Ngày giao dự kiến: {task.deliveryDate}</Typography>
                        <Typography variant="body2">Người nhận: {task.recipientName}</Typography>
                        <Typography variant="body2">SĐT: {task.recipientPhone}</Typography>
                        <Typography variant="body2">Địa chỉ: {formatAddress(task.shippingAddress)}</Typography>
                        <Typography variant="body2">Phí ship: {formatCurrency(task.shippingFee)}</Typography>
                        <Typography variant="body2">Trọng lượng: {task.weight} kg</Typography>
                    </CardContent>
                </Card>
                <TextField
                    label="Ghi chú cho đơn hàng"
                    fullWidth
                    multiline
                    minRows={2}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Trạng thái mới</InputLabel>
                    <Select
                        value={status}
                        label="Trạng thái mới"
                        onChange={e => setStatus(e.target.value)}
                    >
                        {statusOptions.map(opt => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<UpdateIcon />}
                        onClick={() => { onUpdateStatus(task.id, status); onClose(); }}
                    >
                        Cập nhật trạng thái
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<EditNoteIcon />}
                        onClick={() => { onAddNote(task.id, note); onClose(); }}
                    >
                        Lưu ghi chú
                    </Button>
                </CardActions>
            </Box>
        </Modal>
    );
};

export default function MyShipperJobs() {
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders.list || []);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    // Callback cập nhật trạng thái và ghi chú
    const handleUpdateStatus = (id, newStatus) => {
        dispatch(updateOrder({ id, data: { status: newStatus } }));
    };
    const handleAddNote = (id, note) => {
        dispatch(updateOrder({ id, data: { note } }));
    };

    const handleShowDetail = (task) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    const handleCall = (phone) => {
        window.open(`tel:${phone}`);
    };

    const handleMap = (coords) => {
        if (!coords) return;
        const { latitude, longitude } = coords;
        window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
    };

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} md={11} lg={10}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Danh sách đơn giao hàng
                </Typography>
                <TableContainer component={Card}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã vận đơn</TableCell>
                                <TableCell>Người nhận</TableCell>
                                <TableCell>SĐT</TableCell>
                                <TableCell>Địa chỉ giao</TableCell>
                                <TableCell>Ngày lấy</TableCell>
                                <TableCell>Ngày giao dự kiến</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Phí ship</TableCell>
                                <TableCell>Trọng lượng</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((task) => (
                                <TableRow key={task.id} hover>
                                    <TableCell>{task.trackingNumber}</TableCell>
                                    <TableCell>{task.recipientName}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="text"
                                            color="primary"
                                            startIcon={<PhoneIcon />}
                                            onClick={() => handleCall(task.recipientPhone)}
                                        >
                                            {task.recipientPhone}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{formatAddress(task.shippingAddress)}</TableCell>
                                    <TableCell>{task.pickupDate}</TableCell>
                                    <TableCell>{task.deliveryDate}</TableCell>
                                    <TableCell>
                                        <Typography color={
                                            task.status === 'DELIVERED' ? 'success.main' :
                                                task.status === 'SHIPPING' ? 'info.main' :
                                                    'warning.main'
                                        }>
                                            {statusOptions.find(s => s.value === task.status)?.label || task.status}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{formatCurrency(task.shippingFee)}</TableCell>
                                    <TableCell>{task.weight} kg</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="info" onClick={() => handleShowDetail(task)} title="Xem chi tiết">
                                            <InfoIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleCall(task.recipientPhone)} title="Gọi khách">
                                            <PhoneIcon />
                                        </IconButton>
                                        <IconButton color="primary" onClick={() => handleMap(task.shippingAddress.receiverCoords)} title="Chỉ đường">
                                            <MapIcon />
                                        </IconButton>
                                        <IconButton color="success" onClick={() => handleShowDetail(task)} title="Cập nhật trạng thái">
                                            <UpdateIcon />
                                        </IconButton>
                                        <IconButton color="warning" onClick={() => handleShowDetail(task)} title="Ghi chú">
                                            <EditNoteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TaskDetailModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    task={selectedTask}
                    onUpdateStatus={handleUpdateStatus}
                    onAddNote={handleAddNote}
                />
            </Grid>
        </Grid>
    );
}
