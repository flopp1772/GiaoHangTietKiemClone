import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { calculateShippingCost } from "../controllers/shipping.controller.js";

const router = Router();

router.post("/calculate", verifyToken, calculateShippingCost);

export default router;