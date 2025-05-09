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

export const addNewPizza = async (req, res) => {
  try {
    const {
      title,
      description,
      class: classes,
      defaultSize,
      defaultCrustStyle,
      toppings,
      coverImage,
      detailImage,
      status,
    } = req.body;

    const newPizza = new Pizza({
      title,
      description,
      class: classes,
      defaultSize,
      defaultCrustStyle,
      toppings,
      coverImage,
      detailImage,
      status,
    });
    const saved = await newPizza.save();

    console.log("Added new pizza", saved.title);
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating pizza:', err);
    return res.status(500).json({ message: 'Server error while creating pizza' });
  }
};

export const updatePizza = async (req, res) => {
  try {
    const pizzaId = req.params.id;
    const updateData = { ...req.body, updatedAt: Date.now() };
    console.log("Try updating pizza:", pizzaId, updateData);
    const updated = await Pizza.findByIdAndUpdate(pizzaId, updateData, {
      new: true,              // return the updated doc
      runValidators: true,    // enforce schema validators
    });

    if (!updated) {
      return res.status(404).json({ message: 'Pizza not found' });
    }
    console.log("Pizza updated:", pizzaId);
    return res.json(updated);
  } catch (err) {
    console.error('Error updating pizza:', err);
    return res.status(500).json({ message: 'Server error while updating pizza' });
  }
};

export const disablePizza = async (req, res) => {
  const { pizzaId } = req.params;
  console.log("Try disabling pizza:", pizzaId);
  try {
    const pizza = await Pizza.findById(pizzaId);

    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }

    // Set the pizza's status to 'disabled' (don't delete the pizza)
    pizza.status = 'disabled';

    // Save the pizza with the new status
    await pizza.save();

    console.log("Pizza disabled:", pizza.slug);
    res.status(200).json({ message: 'Pizza has been disabled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};