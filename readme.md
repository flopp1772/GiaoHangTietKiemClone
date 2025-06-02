# 🚚 GHTK Clone - Logistics Management System

![build](https://img.shields.io/badge/build-passing-brightgreen)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

**GHTK Clone** là hệ thống quản lý giao vận hiện đại, đa vai trò, tối ưu cho shipper và khách hàng, sử dụng React, Redux Toolkit, Material UI, với luồng dữ liệu đồng bộ, hiệu năng cao và UI thân thiện.

## 🚀 Tính năng nổi bật

- **Khách hàng:** Tạo, theo dõi, quản lý đơn hàng, tra cứu trạng thái, phí ship, chi tiết đơn.
- **Shipper:** Nhận, cập nhật trạng thái, ghi chú, chỉ đường, gọi khách, hoàn thành đơn giao hàng.
- **Admin:** Quản lý tổng thể đơn hàng, người dùng, shipper, báo cáo.
- **UI/UX tối ưu:** Thao tác nhanh, rõ ràng, phù hợp thực tế giao vận.
- **Đồng bộ dữ liệu:** Redux Toolkit, cập nhật trạng thái nhanh, không cần reload toàn bộ danh sách.
- **Tích hợp Google Maps:** Chỉ đường nhanh cho shipper.

## 🛠️ Công nghệ sử dụng

- **Frontend:** ReactJS, Redux Toolkit, Material UI v5
- **State Management:** Redux (ordersSlice, shipperSlice, ...)
- **API:** RESTful, thunk CRUD (fetchOrders, updateOrder, ...)
- **Backend:** (Tuỳ chọn: NodeJS/Express/MongoDB hoặc backend riêng)
- **Khác:** Google Maps, responsive UI, tối ưu hiệu năng

## 📦 Cài đặt & Khởi động

### 1. Yêu cầu hệ thống
- Node.js >= 16.x
- MySQL >= 8.0
- Git
- npm hoặc yarn

### 2. Cài đặt Backend

```bash
# Clone repository
git clone <your-repo-url>
cd GiaoHangTietKiemClone/backend

# Cài đặt dependencies
npm install

# Tạo file .env dựa vào .env.example
# Chạy migrations
npx prisma migrate dev

# Khởi động server
npm run dev
```

### 3. Cài đặt Frontend

```bash
cd ../client

# Cài đặt dependencies
npm install

# Tạo file .env dựa vào .env.example

# Khởi động development server
npm run dev
```

## 🗂️ Cấu trúc thư mục
```
.
└── GiaoHangTietKiemClone/
    ├── .github/                  # GitHub Actions và workflows
    │   └── workflows/            # CI/CD pipelines
    │
    ├── backend/                  # Backend API Server
    │   ├── controllers/          # Business logic handlers
    │   ├── routes/               # API route definitions
    │   ├── middlewares/          # Express middlewares
    │   ├── models/               # Database models
    │   ├── prisma/               # Prisma ORM config
    │   ├── utils/                # Utility functions
    │   ├── generated/            # Generated files
    │   ├── index.js              # Entry point
    │   └── package.json          # Backend dependencies
    │
    ├── client/                   # Frontend React Application
    │   ├── src/                  # Source code
    │   ├── public/               # Static files
    │   ├── dist/                 # Build output
    │   ├── vite.config.js        # Vite configuration
    │   └── package.json          # Frontend dependencies
    │
    ├── CODE_OF_CONDUCT.md        # Code of Conduct
    ├── LICENSE                   # MIT License
    └── README.md                 # Project documentation

```

## ⚡️ Các lệnh npm backend

| Lệnh                             | Mô tả                                        |
|----------------------------------|----------------------------------------------|
| npm start                        | Chạy server backend (Node.js)                |
| npx prisma migrate dev           | Chạy migration Prisma                        |
| npx prisma migrate reset --force | Reset database và migrate lại                |
| npx prisma generate              | Sinh lại Prisma Client                       |
| npx prisma studio                | Mở Prisma Studio (giao diện quản lý DB)      |
| npm run seed                     | Seed dữ liệu mẫu (nếu có script seed)        |
| npm list --depth=0               | Kiểm tra các package đã cài                  |

## ⚡️ Các lệnh npm frontend

| Lệnh                | Mô tả                                         |
|---------------------|-----------------------------------------------|
| npm run dev         | Chạy server phát triển (Vite, hot reload)     |
| npm run build       | Build project cho production                  |
| npm run preview     | Xem thử bản build production trên local       |
| npm run lint        | Kiểm tra code với ESLint                      |

## 🧩 Luồng hoạt động chính

1. **Khách hàng tạo đơn hàng** → Đơn hàng vào trạng thái PROCESSING.
2. **Shipper nhận đơn, cập nhật trạng thái (SHIPPING, DELIVERED), ghi chú, chỉ đường, gọi khách.**
3. **Mọi thay đổi trạng thái/ghi chú đều cập nhật trực tiếp vào Redux store, UI tự động đồng bộ.**
4. **Dữ liệu luôn được lấy mới nhất từ Redux, đảm bảo đồng bộ giữa các thành phần.**

## 📝 Đóng góp

PRs luôn được chào đón! Hãy fork repo, tạo branch mới và gửi pull request.

## 📄 License

Dự án phát hành theo [MIT License](http://www.opensource.org/licenses/MIT).
