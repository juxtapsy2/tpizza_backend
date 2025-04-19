import connectDB from "./config/database.js";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "node:http";
import authRoutes from "./routes/authRoutes.js";
import pizzaRoutes from "./routes/pizzaRoutes.js";

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
const server = createServer(app);
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

connectDB();
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pizza", pizzaRoutes);

// Start the server
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
  res.send('TPizza API is running 🍕');
});
