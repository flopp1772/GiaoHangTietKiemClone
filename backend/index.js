import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import userRouter from "./routes/users.route.js";
import authRouter from "./routes/auth.route.js";
import shippingRouter from "./routes/shipping.route.js";
import orderRoutes from "./routes/order.route.js";

import createAdminUser from "./utils/createAdmin.js";  // Hàm tạo admin user

// Load biến môi trường từ file .env
dotenv.config();

const app = express();

// Middleware xử lý CORS (cho phép client truy cập), cho phép cookie gửi qua
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

// Middleware parse JSON body request
app.use(express.json());

// Middleware parse cookie
app.use(cookieParser());

// Tạo admin user nếu chưa có (chạy 1 lần khi server khởi động)
createAdminUser();

// Các route chính, sắp xếp theo thứ tự hợp lý
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/shipping", shippingRouter);
app.use("/api/orders", orderRoutes);

// Ví dụ thêm route test tạo item (nên tách ra file routes riêng nếu mở rộng)
app.post('/items', (req, res) => {
    const newItem = req.body;
    // Lưu newItem vào DB ở đây (chưa implement)
    res.status(201).json({
        message: 'Item created successfully',
        item: newItem,
    });
});

// Start server lắng nghe trên port config trong env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
