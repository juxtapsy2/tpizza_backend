import connectDB from "./config/database.js";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "node:http";
import authRoutes from "./routes/authRoutes.js";
import pizzaRoutes from "./routes/pizzaRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { isDev, frontendURL, backendURL } from "./constants/constants.js";

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
const server = createServer(app);

console.log("Frontend URL:", frontendURL);
app.use(cors({
  origin: frontendURL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json());
app.use(cookieParser());

connectDB();
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pizza", pizzaRoutes);
app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);

// Start the server
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`Server running on ${backendURL}`);
});

app.get("/", async( req, res ) => {
  return "TPizza is running!"
})