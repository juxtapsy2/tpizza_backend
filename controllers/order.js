
import Order from '../models/OrderModel.js';
import generateUniqueOrderCode from '../utils/generateOrderCode.js';

export const createOrder = async (req, res) => {
  try {
    const { userId, cartItems, totalAmount, paymentMethod } = req.body;
    console.log("Try creating order with data:", req.body);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. User not found.' });
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0 || cartItems.some(item => !item)) {
      return res.status(400).json({ message: 'Cart is empty or contains invalid items.' });
    }
    const orderCode = await generateUniqueOrderCode();
    const newOrder = new Order({
      userId,
      dishes: cartItems,
      totalPrice: totalAmount,
      orderCode,
      paymentMethod: paymentMethod,
      status: 'processing',
      date: new Date(),
    });

    await newOrder.save();
    console.log("Order created:", orderCode);
    res.status(201).json({ message: 'Order created successfully', order: newOrder });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  const userId = req.user.userId;
  console.log("User reviewing orders:", userId);
  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    console.log("Orders fetched.");
    res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Không thể lấy đơn hàng." });
  }
};

export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại." });
    }

    if (order.status !== "processing") {
      return res.status(400).json({ message: "Chỉ có thể huỷ đơn đang xử lý." });
    }

    order.status = "cancelled";
    await order.save();
    console.log("Order cancelled:", orderId);
    res.status(200).json({ message: "Đã huỷ đơn hàng." });
  } catch (err) {
    console.error("Cancel order failed:", err);
    res.status(500).json({ message: "Không thể huỷ đơn hàng." });
  }
};
