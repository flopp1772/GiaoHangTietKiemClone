import { Router } from "express";
import { createUser, login, logout, checkAuth } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", verifyToken, checkAuth);

export default router;
