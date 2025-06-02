import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import userRouter from "./routes/users.route.js";
import authRouter from "./routes/auth.route.js";
import shippingRouter from "./routes/shipping.route.js";
import orderRoutes from "./routes/order.route.js";

import createAdminUser from "./utils/createAdmin.js";  // Hàm tạo admin user
import applyMiddlewares from "./middlewares/index.js";

// Load biến môi trường từ file .env
dotenv.config();

const app = express();

// Middleware xử lý CORS, parse JSON, parse cookie
applyMiddlewares(app);

// Tạo admin user nếu chưa có (chạy 1 lần khi server khởi động)
createAdminUser();

// Các route chính, sắp xếp theo thứ tự hợp lý
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/shipping", shippingRouter);
app.use("/api/orders", orderRoutes);

// Start server lắng nghe trên port config trong env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
