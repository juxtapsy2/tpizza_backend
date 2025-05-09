import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";

export const getSalesOverTime = async (req, res) => {
  const { range = 'daily' } = req.query;
  
  const now = new Date();
  let groupFormat, startDate;

  if (range === 'monthly') {
    groupFormat = { year: { $year: '$date' }, month: { $month: '$date' } };
    startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // last 12 months
  } else if (range === 'weekly') {
    groupFormat = { year: { $isoWeekYear: '$date' }, week: { $isoWeek: '$date' } };
    const past90Days = new Date(now);
    past90Days.setDate(now.getDate() - 90);
    startDate = past90Days;
  } else {
    // default to daily
    groupFormat = { year: { $year: '$date' }, month: { $month: '$date' }, day: { $dayOfMonth: '$date' } };
    const past30Days = new Date(now);
    past30Days.setDate(now.getDate() - 30);
    startDate = past30Days;
  }

  try {
    const result = await Order.aggregate([
      {
        $match: {
          status: 'accomplished',
          date: { $gte: startDate },
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
    console.log("Statistical orders for admin:", result);
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

    console.log("Updated order status:", id, status);
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

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }));
    console.log("Users fetched:", formattedUsers);
    res.status(200).json(formattedUsers);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
