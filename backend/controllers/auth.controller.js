import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

export const createUser = async (req, res) => {
    const {
        store_name,
        email,
        phone,
        password,
        address_detail,
        province,
        district,
        ward,
        role
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!store_name || !email || !phone || !password || !role) {
        console.error("Missing required fields");
        return res.status(400).json({ message: "Store name, email, phone, password, and role are required!" });
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            }
        });

        if (existingUser) {
            console.error("User already exists");
            return res.status(400).json({ message: "Email or phone already registered!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Tạo user
        const user = await prisma.user.create({
            data: {
                store_name,
                email,
                phone,
                password: hashedPassword,
                role,
                // **Bỏ các trường địa chỉ ở đây**
            }
        });

        // 2. Tạo address liên kết với user mới, lọc prefix các trường địa chỉ
        await prisma.address.create({
            data: {
                userId: user.id,
                addressDetail: address_detail || "",  // lưu address_detail ở bảng address
                province: removePrefix(province || ""),
                district: removePrefix(district || ""),
                ward: removePrefix(ward || ""),
                is_deleted: false
            }
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role },  // Thêm role vào payload
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        const { password: pw, ...userWithoutPassword } = user;

        console.log("User created successfully", userWithoutPassword);

        return res.status(201).json({
            message: "User created successfully!",
            user: userWithoutPassword,
            token
        });

    } catch (err) {
        console.error("Error creating user:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};


export const login = async (req, res) => {
    const { login_id, password } = req.body;

    if (!login_id || !password) {
        return res.status(400).json({ message: "Login ID and password are required!" });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: login_id },
                    { phone: login_id }
                ]
            }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password!" });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },  // Thêm role vào payload
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        const { password: pw, ...userWithoutPassword } = user;

        return res.status(200).json({
            message: "Login successful!",
            user: userWithoutPassword,
            token
        });

    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully!" });
};

// Hàm controller mới để kiểm tra trạng thái xác thực
export const checkAuth = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: "User ID not found in request. Token verification failed." });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                store_name: true,
                email: true,
                phone: true,
                role: true,
                created_at: true,
                updated_at: true,
                // Lấy thông tin địa chỉ từ bảng address
                addresses: {
                    where: {
                        is_deleted: false
                    },
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

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: "User authenticated.",
            user: user
        });

    } catch (err) {
        console.error("Error checking auth status:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
