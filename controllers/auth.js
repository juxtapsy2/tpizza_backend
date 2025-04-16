import crypto from "crypto";
import argon2 from "argon2";
import User from "../models/UserModel.js";
import sendEmail from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, username, password, gender, dateOfBirth, phone } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại." });
    }
    
    const hashedPassword = await argon2.hash(password);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = Date.now() + 1000 * 60 * 10; // 10'

    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      gender,
      dateOfBirth,
      phone,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    user.status = "active";
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    res.status(201).json({ message: "Đăng ký thành công." });
    console.log("Đăng ký người dùng thành công: ", user.username);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ." });
    console.log("Error registering user:", error);
  }
};

export const verifyEmail = async (req, res) => {
    const { token } = req.query;
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });
  
    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
    // Update user status
    user.status = "active";
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
  
    res.status(200).json({ message: "Xác minh email thành công!" });
  };
  