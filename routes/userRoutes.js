import express from "express";
import { extractUserFromToken, updateProfile, changePassword, updateAvatar } from "../controllers/user.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", extractUserFromToken);

router.put("/me/update", verifyToken, updateProfile);
router.put('/me/change-password', verifyToken, changePassword);
router.put('/me/avatar', verifyToken, updateAvatar);

export default router;
