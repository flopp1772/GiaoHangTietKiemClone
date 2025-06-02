import { Router } from "express";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderById,
    deleteOrderById,
    restoreOrderById,
} from "../controllers/order.controller.js";

import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = Router();

// Tất cả route dưới đây phải có token hợp lệ
router.use(verifyToken);

// Chỉ customer và admin được tạo đơn
router.post("/", verifyRole(['customer', 'admin']), createOrder);

// Lấy danh sách đơn hàng (có thể thêm phân quyền trong getAllOrders nếu cần)
router.get("/", getAllOrders);
router.get("/:id", getOrderById);

// Cập nhật đơn - chỉ admin và staff được phép
router.put("/:id", verifyRole(['admin', 'shipper', 'customer']), updateOrderById);

// Xóa mềm đơn - chỉ admin và customer được phép
router.delete("/:id", verifyRole(['admin', 'customer']), deleteOrderById);

// Phục hồi đơn - chỉ admin được phép
router.put("/:id/restore", verifyRole(['admin']), restoreOrderById);

export default router;
