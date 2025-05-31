# 🚚 GHTK Clone - Logistics Management System

![build](https://img.shields.io/badge/build-passing-brightgreen)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

**GHTK Clone** là hệ thống quản lý giao vận hiện đại, đa vai trò, tối ưu cho shipper và khách hàng, sử dụng React, Redux Toolkit, Material UI, với luồng dữ liệu đồng bộ, hiệu năng cao và UI thân thiện.

---

## 🚀 Tính năng nổi bật

- **Khách hàng:** Tạo, theo dõi, quản lý đơn hàng, tra cứu trạng thái, phí ship, chi tiết đơn.
- **Shipper:** Nhận, cập nhật trạng thái, ghi chú, chỉ đường, gọi khách, hoàn thành đơn giao hàng.
- **Admin:** Quản lý tổng thể đơn hàng, người dùng, shipper, báo cáo.
- **UI/UX tối ưu:** Thao tác nhanh, rõ ràng, phù hợp thực tế giao vận.
- **Đồng bộ dữ liệu:** Redux Toolkit, cập nhật trạng thái nhanh, không cần reload toàn bộ danh sách.
- **Tích hợp Google Maps:** Chỉ đường nhanh cho shipper.

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** ReactJS, Redux Toolkit, Material UI v5
- **State Management:** Redux (ordersSlice, shipperSlice, ...)
- **API:** RESTful, thunk CRUD (fetchOrders, updateOrder, ...)
- **Backend:** (Tuỳ chọn: NodeJS/Express/MongoDB hoặc backend riêng)
- **Khác:** Google Maps, responsive UI, tối ưu hiệu năng

---

## 📦 Cài đặt & Khởi động

```sh
git clone <your-repo-url>
cd <your-repo-folder>
npm install
npm start
```
> **Lưu ý:** Đảm bảo backend/API đã chạy và cấu hình endpoint đúng trong `.env`.

---

## 🗂️ Cấu trúc thư mục

---

## ⚡️ Các lệnh npm

| Lệnh                | Mô tả                                 |
|---------------------|---------------------------------------|
| npm start           | Chạy dev server với hot reload         |
| npm run build       | Build production                      |
| npm run test        | Chạy test                             |
| npm run lint        | Kiểm tra lint                         |

---

## 🧩 Luồng hoạt động chính

1. **Khách hàng tạo đơn hàng** → Đơn hàng vào trạng thái PROCESSING.
2. **Shipper nhận đơn, cập nhật trạng thái (SHIPPING, DELIVERED), ghi chú, chỉ đường, gọi khách.**
3. **Mọi thay đổi trạng thái/ghi chú đều cập nhật trực tiếp vào Redux store, UI tự động đồng bộ.**
4. **Dữ liệu luôn được lấy mới nhất từ Redux, đảm bảo đồng bộ giữa các thành phần.**

---

## 📝 Đóng góp

PRs luôn được chào đón! Hãy fork repo, tạo branch mới và gửi pull request.

---

## 📄 License

Dự án phát hành theo [MIT License](http://www.opensource.org/licenses/MIT).