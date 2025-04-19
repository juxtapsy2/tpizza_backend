import mongoose from "mongoose";
/**
 * Kết nối với MongoDB sử dụng Mongoose.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  const uri = "mongodb://localhost:27017/tpizza" || process.env.CONNECT_STRING
  try {
    await mongoose.connect(uri);
    console.log("Connected to database.");
  } catch (error) {
    console.error("Error connecting db:", error.message);
    process.exit(1);
  }
};

export default connectDB;