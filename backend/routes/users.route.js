import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Admin routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
