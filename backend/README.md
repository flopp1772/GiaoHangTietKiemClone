# GHTK Clone Backend

## Yêu cầu
- Node.js >= 16
- MySQL

## Cài đặt

```bash
npm install
```

## Thiết lập môi trường
- Tạo file `.env` dựa trên mẫu `.env.example` (nếu có)
- Cấu hình biến `DATABASE_URL` cho MySQL

## Các lệnh npm backend

| Lệnh                        | Mô tả                                         |
|-----------------------------|-----------------------------------------------|
| npm start                   | Chạy server backend (Node.js)                 |
| npx prisma migrate dev      | Chạy migration Prisma                        |
| npx prisma migrate reset --force | Reset database và migrate lại           |
| npx prisma generate         | Sinh lại Prisma Client                       |
| npx prisma studio           | Mở Prisma Studio (giao diện quản lý DB)      |
| npm run seed                | Seed dữ liệu mẫu (nếu có script seed)        |
| npm list --depth=0          | Kiểm tra các package đã cài                  |

## ⚡️ Các lệnh npm frontend

| Lệnh                | Mô tả                                         |
|---------------------|-----------------------------------------------|
| npm run dev         | Chạy server phát triển (Vite, hot reload)     |
| npm run build       | Build project cho production                  |
| npm run preview     | Xem thử bản build production trên local       |
| npm run lint        | Kiểm tra code với ESLint                      |

## Các package chính
- express
- @prisma/client & prisma
- mysql2
- dotenv
- bcryptjs
- jsonwebtoken
- axios
- geolib
- swagger-jsdoc, swagger-ui-express

## Khởi động API
Sau khi cài đặt và migrate, chạy:
```bash
npm start
```
API sẽ chạy ở cổng mặc định (xem trong file `.env` hoặc `index.js`). 