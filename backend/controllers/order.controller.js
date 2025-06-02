import { PrismaClient, OrderStatus } from '@prisma/client';
import { nanoid } from 'nanoid';
import { getDistance } from 'geolib';

const prisma = new PrismaClient();

function removePrefix(name = '') {
    return name
        .replace(/^Tỉnh\s+/i, '')
        .replace(/^Thành phố\s+/i, '')
        .replace(/^Quận\s+/i, '')
        .replace(/^Huyện\s+/i, '')
        .replace(/^Phường\s+/i, '')
        .replace(/^Xã\s+/i, '');
}

export const createOrder = async (req, res) => {
    try {
        const {
            shippingFee,
            shippingAddress,
            productName,
            description,
            recipientName,
            recipientPhone,
            weight,
            quantity
        } = req.body;

        const {
            addressDetail,
            province,
            district,
            ward,
            zip,
            receiverCoords
        } = shippingAddress || {};

        console.log('==> [createOrder] req.body:', JSON.stringify(req.body, null, 2));
        console.log('==> [createOrder] shippingAddress:', JSON.stringify(shippingAddress, null, 2));
        console.log('==> [createOrder] receiverCoords:', receiverCoords);

        // Kiểm tra các trường bắt buộc
        if (!recipientPhone || !addressDetail || !province || !district || !ward || !quantity || !weight || !productName || !recipientName) {
            console.log('==> [createOrder] Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Tìm shipper phù hợp
        const activeShippers = await prisma.user.findMany({
            where: {
                role: 'shipper',
                status: 'ACTIVE',
                is_deleted: false
            },
            select: {
                id: true,
                addresses: {
                    where: {
                        is_deleted: false
                    },
                    select: {
                        latitude: true,
                        longitude: true
                    }
                }
            }
        });
        console.log('==> [createOrder] activeShippers:', JSON.stringify(activeShippers, null, 2));

        if (activeShippers.length === 0) {
            console.log('==> [createOrder] No available shippers');
            return res.status(400).json({ error: 'No available shippers' });
        }

        // 2. Tìm shipper gần nhất
        let nearestShipper = null;
        let minDistance = Infinity;

        for (const shipper of activeShippers) {
            const shipperAddress = shipper.addresses[0];
            if (!shipperAddress) {
                console.log(`==> [createOrder] Shipper ${shipper.id} has no address, skipping.`);
                continue;
            }
            const distance = getDistance(
                { latitude: receiverCoords.latitude, longitude: receiverCoords.longitude },
                { latitude: shipperAddress.latitude, longitude: shipperAddress.longitude }
            );
            console.log(`==> [createOrder] Shipper ${shipper.id} distance:`, distance);
            if (distance < minDistance) {
                minDistance = distance;
                nearestShipper = {
                    id: shipper.id,
                    latitude: shipperAddress.latitude,
                    longitude: shipperAddress.longitude
                };
            }
        }

        console.log('==> [createOrder] nearestShipper:', nearestShipper);

        if (!nearestShipper) {
            console.log('==> [createOrder] Could not find suitable shipper');
            return res.status(400).json({ error: 'Could not find suitable shipper' });
        }

        // 3. Sinh trackingNumber
        const trackingNumber = nanoid(12);
        console.log('==> [createOrder] trackingNumber:', trackingNumber);

        // 4. Tạo order và shipment trong transaction
        const newOrder = await prisma.$transaction(async (prisma) => {
            // 4.1 Tạo order
            const order = await prisma.order.create({
                data: {
                    customerId: req.userId,
                    shippingFee: parseFloat(shippingFee) || 0,
                    addressDetail: addressDetail || "",
                    province: removePrefix(province || ""),
                    district: removePrefix(district || ""),
                    ward: removePrefix(ward || ""),
                    zip: zip || "",
                    recipientName,
                    recipientPhone,
                    description,
                    productName,
                    weight: parseFloat(weight),
                    quantity: parseInt(quantity),
                    status: OrderStatus.PROCESSING,
                    latitude: receiverCoords.latitude,
                    longitude: receiverCoords.longitude
                }
            });
            console.log('==> [createOrder] Created order:', order);

            // 4.2 Tạo shipment
            const shipment = await prisma.shipment.create({
                data: {
                    orderId: order.id,
                    shipperId: nearestShipper.id,
                    pickupDate: new Date(),
                    deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    trackingNumber
                }
            });
            console.log('==> [createOrder] Created shipment:', shipment);

            // 4.3 Cập nhật trạng thái shipper
            // await prisma.user.update({
            //     where: { id: nearestShipper.id },
            //     data: { status: 'BUSY' }
            // });
            // console.log(`==> [createOrder] Updated shipper ${nearestShipper.id} status to BUSY`);

            return { order, shipment };
        });

        console.log('==> [createOrder] Transaction result:', newOrder);
        return res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order and shipment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


export const getAllOrders = async (req, res) => {
    try {
        if (req.role === "admin") {
            // Admin: lấy tất cả đơn hàng
            const orders = await prisma.order.findMany({
                where: { is_deleted: false },
                orderBy: { orderDate: "desc" },
                select: {
                    id: true,
                    shipments: {
                        select: {
                            trackingNumber: true
                        }
                    },
                    recipientName: true,
                    productName: true,
                    status: true,
                    shippingFee: true
                }
            });
            const transformedOrders = orders.map(order => ({
                trackingNumber: order.shipments[0]?.trackingNumber || null,
                recipientName: order.recipientName,
                productName: order.productName,
                status: order.status,
                shippingFee: order.shippingFee
            }));
            return res.json(transformedOrders);
        } else if (req.role === "customer") {
            // Customer: lấy đơn hàng của chính mình
            const orders = await prisma.order.findMany({
                where: {
                    customerId: req.userId,
                    is_deleted: false,
                },
                orderBy: { orderDate: "desc" },
                select: {
                    shipments: {
                        select: {
                            trackingNumber: true
                        }
                    },
                    recipientName: true,
                    productName: true,
                    status: true,
                    shippingFee: true
                }
            });
            const transformedOrders = orders.map(order => ({
                trackingNumber: order.shipments[0]?.trackingNumber || null,
                recipientName: order.recipientName,
                productName: order.productName,
                status: order.status,
                shippingFee: order.shippingFee
            }));
            return res.json(transformedOrders);
        } else if (req.role === "shipper") {
            // Shipper: lấy các shipment của mình, join sang order
            const shipments = await prisma.shipment.findMany({
                where: {
                    shipperId: req.userId,
                    is_deleted: false
                },
                orderBy: { pickupDate: "desc" },
                include: {
                    order: true // lấy toàn bộ thông tin order
                }
            });
            const transformed = shipments.map(s => ({
                id: s.order.id,
                trackingNumber: s.trackingNumber,
                recipientName: s.order.recipientName,
                recipientPhone: s.order.recipientPhone,
                shippingAddress: {
                    addressDetail: s.order.addressDetail,
                    ward: s.order.ward,
                    district: s.order.district,
                    province: s.order.province,
                    zip: s.order.zip,
                    receiverCoords: {
                        latitude: s.order.latitude,
                        longitude: s.order.longitude
                    }
                },
                pickupDate: s.pickupDate,
                deliveryDate: s.deliveryDate,
                status: s.order.status,
                shippingFee: s.order.shippingFee,
                weight: s.order.weight,
                note: s.order.note // nếu có trường note trong order
            }));
            return res.json(transformed);
        } else {
            return res.status(403).json({ message: "Permission denied" });
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid order id' });

        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order || order.is_deleted) {
            return res.status(404).json({ error: 'Order not found' });
        }

        return res.json(order);
    } catch (error) {
        console.error('Error fetching order by id:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateOrderById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid order id' });

        // Kiểm tra quyền sở hữu hoặc admin hoặc shipper đang giao đơn này
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order || order.is_deleted) {
            return res.status(404).json({ error: 'Order not found' });
        }

        let canUpdate = false;
        if (req.role === "admin" || order.customerId === req.userId) {
            canUpdate = true;
        } else if (req.role === "shipper") {
            // Kiểm tra shipper có đang giao đơn này không
            const shipment = await prisma.shipment.findFirst({
                where: {
                    orderId: id,
                    shipperId: req.userId,
                    is_deleted: false
                }
            });
            if (shipment) canUpdate = true;
        }
        if (!canUpdate) {
            return res.status(403).json({ message: "Permission denied" });
        }

        // Destructure tất cả các trường có thể cập nhật trực tiếp từ req.body
        const {
            shippingFee,
            addressDetail,
            province,
            district,
            ward,
            zip,
            latitude,
            longitude,
            recipientName,
            recipientPhone,
            note,
            weight,
            quantity,
            status
        } = req.body;

        // Nếu là shipper chỉ cho phép cập nhật status
        let updateData = {};
        if (req.role === "shipper") {
            if (typeof status !== 'undefined') updateData.status = status;
        } else {
            // Admin/Customer cập nhật trực tiếp các trường
            updateData = {
                shippingFee,
                addressDetail,
                province,
                district,
                ward,
                zip,
                latitude,
                longitude,
                recipientName,
                recipientPhone,
                note,
                weight,
                quantity,
                status
            };
        }

        await prisma.order.update({
            where: { id },
            data: updateData,
        });

        // Nếu là shipper, trả về object mapping giống getAllOrders (role shipper)
        if (req.role === "shipper") {
            // Lấy lại shipment vừa update (của shipper này và order này)
            const shipment = await prisma.shipment.findFirst({
                where: {
                    orderId: id,
                    shipperId: req.userId,
                    is_deleted: false
                },
                include: {
                    order: true
                }
            });
            if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
            const mapped = {
                id: shipment.order.id,
                trackingNumber: shipment.trackingNumber,
                recipientName: shipment.order.recipientName,
                recipientPhone: shipment.order.recipientPhone,
                shippingAddress: {
                    addressDetail: shipment.order.addressDetail,
                    ward: shipment.order.ward,
                    district: shipment.order.district,
                    province: shipment.order.province,
                    zip: shipment.order.zip,
                    receiverCoords: {
                        latitude: shipment.order.latitude,
                        longitude: shipment.order.longitude
                    }
                },
                pickupDate: shipment.pickupDate,
                deliveryDate: shipment.deliveryDate,
                status: shipment.order.status,
                shippingFee: shipment.order.shippingFee,
                weight: shipment.order.weight,
                note: shipment.order.note
            };
            return res.json(mapped);
        }

        // Các role khác trả về order đầy đủ (bao gồm shipments)
        const updatedOrder = await prisma.order.findUnique({
            where: { id },
            include: {
                shipments: true
            }
        });
        return res.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteOrderById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid order id' });

        const order = await prisma.order.findUnique({ where: { id } });
        if (!order || order.is_deleted) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (req.role !== "admin" && order.customerId !== req.userId) {
            return res.status(403).json({ message: "Permission denied" });
        }

        const deletedOrder = await prisma.order.update({
            where: { id },
            data: {
                is_deleted: true,
                deleted_at: new Date(),
            },
        });

        return res.json({ message: "Order deleted successfully", order: deletedOrder });
    } catch (error) {
        console.error("Error deleting order:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const restoreOrderById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid order id' });

        // Tìm order kể cả đã xoá mềm (is_deleted = true)
        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (!order.is_deleted) {
            return res.status(400).json({ error: 'Order is not deleted' });
        }

        // Cập nhật is_deleted về false và xoá trường deleted_at
        const restoredOrder = await prisma.order.update({
            where: { id },
            data: {
                is_deleted: false,
                deleted_at: null,
            },
        });

        return res.json(restoredOrder);
    } catch (error) {
        console.error('Error restoring order:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

