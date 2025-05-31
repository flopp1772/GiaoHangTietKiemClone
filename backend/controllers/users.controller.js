import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getCoordinatesFromAddress } from './shipping.controller.js';
const prisma = new PrismaClient();

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        if (req.role !== "admin") {
            return res.status(403).json({ message: "Permission denied" });
        }

        const users = await prisma.user.findMany({
            where: { is_deleted: false },
            select: {
                id: true,
                email: true,
                store_name: true,
                phone: true,
                role: true,
                created_at: true,
                updated_at: true,
                addresses: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        addressDetail: true,
                        province: true,
                        district: true,
                        ward: true,
                        postalCode: true
                    }
                }
            }
        });

        return res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get user by ID (admin only)
export const getUserById = async (req, res) => {
    try {
        if (req.role !== "admin") {
            return res.status(403).json({ message: "Permission denied" });
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                store_name: true,
                phone: true,
                role: true,
                created_at: true,
                updated_at: true,
                addresses: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        addressDetail: true,
                        province: true,
                        district: true,
                        ward: true,
                        postalCode: true
                    }
                }
            }
        });

        if (!user || user.is_deleted) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

function removePrefix(name = '') {
    return name
        .replace(/^Tỉnh\s+/i, '')
        .replace(/^Thành phố\s+/i, '')
        .replace(/^Quận\s+/i, '')
        .replace(/^Huyện\s+/i, '')
        .replace(/^Phường\s+/i, '')
        .replace(/^Xã\s+/i, '');
}

// Create new user (admin only)
export const createUser = async (req, res) => {
    try {
        if (req.role !== "admin") {
            return res.status(403).json({ message: "Permission denied" });
        }

        console.log('createUser req.body:', req.body);

        const {
            email,
            password,
            store_name,
            phone,
            role,
            addresses // [{ addressDetail, province, district, ward, postalCode }]
        } = req.body;

        // Validate required fields
        if (!email || !password || !store_name || !role || !phone) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if email or phone already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: "Email or phone already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Tạo user trước
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                store_name,
                phone,
                role
            }
        });

        // 2. Tạo các address liên kết userId
        if (addresses && Array.isArray(addresses)) {
            for (const address of addresses) {
                let latitude = null;
                let longitude = null;
                if (role === 'shipper') {
                    // Ghép chuỗi địa chỉ để geocode
                    const addressString = [
                        address.addressDetail || address.address_detail || "",
                        address.ward || "",
                        address.district || "",
                        address.province || "",
                        address.postalCode || address.postal_code || "",
                        'Vietnam'
                    ].filter(Boolean).join(', ');
                    try {
                        const coords = await getCoordinatesFromAddress(addressString);
                        latitude = coords.latitude;
                        longitude = coords.longitude;
                        console.log('Tọa độ lấy được cho shipper:', { latitude, longitude, addressString });
                    } catch (err) {
                        console.error('Không lấy được tọa độ cho địa chỉ shipper:', addressString, err.message);
                    }
                }
                await prisma.address.create({
                    data: {
                        userId: user.id,
                        addressDetail: address.addressDetail || address.address_detail || "",
                        province: removePrefix(address.province || ""),
                        district: removePrefix(address.district || ""),
                        ward: removePrefix(address.ward || ""),
                        postalCode: address.postalCode || address.postal_code || "",
                        latitude,
                        longitude,
                        is_deleted: false
                    }
                });
            }
        }

        // Lấy lại user kèm addresses (không trả về password)
        const userWithAddresses = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                store_name: true,
                phone: true,
                role: true,
                created_at: true,
                addresses: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        addressDetail: true,
                        province: true,
                        district: true,
                        ward: true,
                        postalCode: true,
                        latitude: true,
                        longitude: true
                    }
                }
            }
        });

        return res.status(201).json(userWithAddresses);
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Update user (admin only)
export const updateUser = async (req, res) => {
    try {
        if (req.role !== "admin") {
            return res.status(403).json({ message: "Permission denied" });
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const {
            email,
            store_name,
            phone,
            role,
            addresses
        } = req.body;

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user || user.is_deleted) {
            return res.status(404).json({ error: "User not found" });
        }

        // Cập nhật user (không cập nhật password)
        await prisma.user.update({
            where: { id },
            data: {
                email,
                store_name,
                phone,
                role
            }
        });

        // Xử lý cập nhật addresses: soft delete cũ, tạo mới từ req.body
        if (addresses && Array.isArray(addresses)) {
            // Soft delete tất cả địa chỉ cũ
            await prisma.address.updateMany({
                where: { userId: id, is_deleted: false },
                data: { is_deleted: true, deleted_at: new Date() }
            });
            // Tạo mới các địa chỉ
            for (const address of addresses) {
                await prisma.address.create({
                    data: {
                        userId: id,
                        addressDetail: address.addressDetail || address.address_detail || "",
                        province: removePrefix(address.province || ""),
                        district: removePrefix(address.district || ""),
                        ward: removePrefix(address.ward || ""),
                        postalCode: address.postalCode || address.postal_code || "",
                        is_deleted: false
                    }
                });
            }
        }

        // Lấy lại user kèm addresses (không trả về password)
        const userWithAddresses = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                store_name: true,
                phone: true,
                role: true,
                updated_at: true,
                addresses: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        addressDetail: true,
                        province: true,
                        district: true,
                        ward: true,
                        postalCode: true
                    }
                }
            }
        });

        return res.json(userWithAddresses);
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Delete user (soft delete, admin only)
export const deleteUser = async (req, res) => {
    try {
        if (req.role !== "admin") {
            return res.status(403).json({ message: "Permission denied" });
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user || user.is_deleted) {
            return res.status(404).json({ error: "User not found" });
        }

        // Xóa mềm user
        await prisma.user.update({
            where: { id },
            data: {
                is_deleted: true,
                deleted_at: new Date()
            }
        });

        // Xóa mềm tất cả address liên quan
        const addressDeleteResult = await prisma.address.updateMany({
            where: { userId: id, is_deleted: false },
            data: { is_deleted: true, deleted_at: new Date() }
        });
        console.log('Số address bị xóa mềm:', addressDeleteResult.count);

        return res.json({ message: "User and addresses deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
