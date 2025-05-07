import Order from "../models/OrderModel.js";
import { v4 as uuidv4 } from 'uuid';

export default async function generateUniqueOrderCode() {
    const MAX_RETRIES = 5;
    for (let i = 0; i < MAX_RETRIES; i++) {
      const code = uuidv4().slice(-6);
      const exists = await Order.findOne({ orderCode: code });
      if (!exists) return code;
    }
    throw new Error('Failed to generate unique orderCode after multiple attempts');
  }