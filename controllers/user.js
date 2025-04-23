import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const getUserByToken = async(req, res) => {
    try {
      const token = req.cookies.token;
  
      if (!token) return res.status(401).json({ message: 'Không có token.' });
  
      const decoded = jwt.verify(token, process.env.THE_JWT_KEY_HACKERS_LONG_FOR);
      const user = await User.findById(decoded.userId).select('-password');
  
      if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });
  
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};
