import express from "express";
import { getUserByToken } from "../controllers/user.js";

const router = express.Router();

router.get("/me", getUserByToken);

export default router;
