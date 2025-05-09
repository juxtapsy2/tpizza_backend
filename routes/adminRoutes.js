import express from "express";
import { getSalesOverTime, getAllOrders, updateOrderStatus, getUserById, getAllUsers } from "../controllers/admin.js";
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/sales', verifyToken, verifyAdmin, getSalesOverTime);
router.get('/orders', verifyToken, verifyAdmin, getAllOrders);
router.get('/user/:userId', verifyToken, verifyAdmin, getUserById);
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.put('/update-status/:id/status', verifyToken, verifyAdmin, updateOrderStatus);

export default router;
