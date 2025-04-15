import mongoose from "mongoose";
/**
 * Kết nối với MongoDB sử dụng Mongoose.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECT_STRING);
    console.log("Connected to database.");
  } catch (error) {
    console.error("Error connecting db:", error.message);
    process.exit(1);
  }
};

export default connectDB;