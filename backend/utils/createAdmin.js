import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Tạo instance PrismaClient
const prisma = new PrismaClient();

// Hàm tạo admin user
const createAdminUser = async () => {
    try {
        // Kiểm tra xem admin đã tồn tại chưa
        const existingAdmin = await prisma.user.findFirst({
            where: {
                email: 'admin@example.com',
                role: 'admin'
            }
        });

        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Tạo admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = await prisma.user.create({
            data: {
                store_name: 'Admin',
                email: 'admin@example.com',
                phone: '0123456789',
                password: hashedPassword,
                role: 'admin'
            }
        });

        // Tạo địa chỉ cho admin
        await prisma.address.create({
            data: {
                userId: admin.id,
                addressDetail: 'Admin Address',
                province: 'Hà Nội',
                district: 'Cầu Giấy',
                ward: 'Dịch Vọng',
                postalCode: '100000',
                is_deleted: false
            }
        });

        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Lỗi khi tạo admin:', error);
    }
};

// Export hàm để sử dụng ở nơi khác
export default createAdminUser;
