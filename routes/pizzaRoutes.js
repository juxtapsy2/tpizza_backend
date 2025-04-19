import express from "express";
import { getAllPizzas } from "../controllers/pizza.js";

const router = express.Router();

// GET /api/pizza
router.get("/", getAllPizzas);

export default router;