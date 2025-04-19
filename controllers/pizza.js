import Pizza from "../models/PizzaModel.js";

// @desc    Get all pizzas
// @route   GET /api/pizzas
// @access  Public
export const getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ status: "enabled" }).sort({ createdAt: -1 });
    res.status(200).json(pizzas);
  } catch (error) {
    console.log("Error fetching pizzas:", error);
    res.status(500).json({ message: "Server error" });
  }
};