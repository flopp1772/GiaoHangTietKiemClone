import mysql from "mysql";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Kiểm tra kết nối DB khi khởi động
pool.getConnection((err, connection) => {
    if (err) {
        console.error("[MySQL] Kết nối thất bại:", err.message);
    } else {
        console.log("[MySQL] Kết nối thành công!");
        connection.release();
    }
});

export default pool;