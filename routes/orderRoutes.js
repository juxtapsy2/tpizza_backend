import express from "express";
import { cancelOrder, createOrder, getOrdersByUser } from "../controllers/order.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/my-orders/:userId", verifyToken, getOrdersByUser);
router.patch("/cancel/:orderId", verifyToken, cancelOrder);

export default router;
