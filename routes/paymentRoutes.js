import express from "express";
import { payWithMomo } from "../controllers/payment.js";

const router = express.Router();

router.post("/momo", payWithMomo);
// router.post("/cod", payWithCOD);

export default router;
