import express from "express";
import { extractUserFromToken } from "../controllers/user.js";

const router = express.Router();

router.get("/me", extractUserFromToken);

export default router;
