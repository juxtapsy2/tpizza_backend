import express from "express";
import { addNewPizza, disablePizza, getAllPizzas, updatePizza } from "../controllers/pizza.js";

const router = express.Router();

// GET /api/pizza
router.get("/", getAllPizzas);
router.post('/new', addNewPizza);
router.put('/edit/:id', updatePizza);
router.put('/disable/:pizzaId', disablePizza);

export default router;