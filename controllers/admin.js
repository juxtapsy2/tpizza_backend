import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";

export const getSalesOverTime = async (req, res) => {
  const { range = 'daily' } = req.query;

  const now = new Date();
  let groupFormat, startDate;

  if (range === 'monthly') {
    groupFormat = { year: { $year: '$orderDate' }, month: { $month: '$orderDate' } };
    startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // last 12 months
  } else if (range === 'weekly') {
    groupFormat = { year: { $year: '$orderDate' }, week: { $isoWeek: '$orderDate' } };
    const past90Days = new Date(now);
    past90Days.setDate(now.getDate() - 90);
    startDate = past90Days;
  } else {
    // default to daily
    groupFormat = { year: { $year: '$orderDate' }, month: { $month: '$orderDate' }, day: { $dayOfMonth: '$orderDate' } };
    const past30Days = new Date(now);
    past30Days.setDate(now.getDate() - 30);
    startDate = past30Days;
  }

  try {
    const result = await Order.aggregate([
      {
        $match: {
          status: 'accomplished',
          orderDate: { $gte: startDate },
        }
      },
      {
        $group: {
          _id: groupFormat,
          totalRevenue: { $sum: '$totalPrice' },
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching sales data:', err);
    res.status(500).json({ message: 'Failed to fetch sales data' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 }).populate('userId', 'username email');
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

