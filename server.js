// Import necessary modules
import connectDB from "./config/database.js";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "node:http";

// Load environment variables
dotenv.config();
// Initialize the app
const app = express();
const server = createServer(app);
app.use(express.json());
app.use(cors());
// Middleware to parse JSON data
app.use(bodyParser.json());

connectDB();
// Define a basic route
app.get('/', (req, res) => {
  res.send('Welcome to my custom Node.js backend!');
});

// Start the server
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});