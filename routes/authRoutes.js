import express from "express";
import { registerUser, verifyEmail } from "../controllers/auth.js";

const router = express.Router();

// POST /api/users/register
router.post("/register", registerUser);

// GET
router.get("/verify-email", verifyEmail);

export default router;
