import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import cloudInstance from "../config/cloudinary.js";
import sharp from 'sharp';
import fs from 'fs/promises';
import path from "path";
import os from "os";

export const extractUserFromToken = async(req, res) => {
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

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, gender, dateOfBirth, phone, username, avatar } = req.body;

    // Update excluding email
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, gender, dateOfBirth, phone, username, avatar },
      { new: true, runValidators: true }
    ).select("-password");
    console.log("User updated profile:", updatedUser.username);
    res.status(200).json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Cập nhật thất bại. Vui lòng kiểm tra lại thông tin." });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    const isMatch = await argon2.verify(user.password, currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không chính xác." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Vui lòng xác nhận lại mật khẩu mới." });
    }

    user.password = await argon2.hash(newPassword);
    await user.save();
    
    console.log("User changed password:", user.username);
    res.status(200).json({ message: "Đổi mật khẩu thành công." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Không thể đổi mật khẩu. Vui lòng kiểm tra thông tin." });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Ảnh không được để trống' });
    }
    const tmpDir = os.tmpdir();
    // Decode base64 string (strip "data:image/jpeg;base64," if present)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const resizedPath = path.join(tmpDir, `${req.user.username}-resized.jpg`);

    await sharp(buffer)
      .resize({ width: 250 })
      .jpeg()
      .toFile(resizedPath);

    const result = await cloudInstance.uploader.upload(resizedPath, {
      folder: 'TPizza/avatars',
      public_id: `${req.user.username}-avatar`,
      overwrite: true,
    });

    await fs.unlink(resizedPath);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: 'Cập nhật ảnh đại diện thành công!',
      user: updatedUser,
    });
    console.log("User updated avatar:", req.user.username);
  } catch (err) {
    console.error('Avatar update error:', err);
    res.status(500).json({ message: 'Cập nhật ảnh thất bại' });
  }
};
