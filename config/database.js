import mongoose from "mongoose";
/**
 * Kết nối với MongoDB sử dụng Mongoose.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  const uri = process.env.CONNECT_STRING || "mongodb://localhost:27017/tpizza"
  try {
    await mongoose.connect(uri);
    console.log("Connected to database.");
  } catch (error) {
    console.error("Error connecting db:", error.message);
    process.exit(1);
  }
};

export default connectDB;