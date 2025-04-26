import crypto from "crypto";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import sendEmail from "../utils/sendEmail.js";
import { verifyEmailTemplate } from "../constants/verifyEmailTemplate.js";
import { frontendURL, isDev, cookieDomain } from "../constants/constants.js";

export const sendVerificationEmail = async (to, token) => {
  const url = `${frontendURL}/verify-email?token=${token}`;
  const author = process.env.BREVO_EMAIL;
  const verifyTemplate = verifyEmailTemplate(url);

  await sendEmail({
    from: `"TPizza 🍕" <${author}>`,
    to,
    subject: "Xác minh tài khoản TPizza của bạn",
    html: verifyTemplate,
  });
};

// Register a new user with email verification
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
    const verificationExpires = Date.now() + 1000 * 60 * 10; // 10min

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

    // Send email with the verification token
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({ message: "Đăng ký thành công. Vui lòng kiểm tra email của bạn để xác minh tài khoản." });
    console.log("User registered: ", user.username);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ." });
    console.log("Error registering user:", error);
  }
};

// Verify email address with the token
export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  console.log("Received token:", token);

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() }, // Token has not expired
  });

  if (!user) {
    return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }

  // Update user status to active
  user.status = "active";
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  console.log("Email verified:", user.email);
  res.status(200).json({ message: "Xác minh email thành công!" });
};

// Login user and generate JWT
export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // Allow 'identifier' to be either email or username

    let user;
    if (/\S+@\S+\.\S+/.test(identifier)) {  // email regex
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại." });
    }

    // Check if email is verified
    if (user.status !== "active") {
      return res.status(400).json({ message: "Tài khoản chưa được xác minh. Vui lòng kiểm tra email của bạn." });
    }

    // Verify the password
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không chính xác." });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.THE_JWT_KEY_HACKERS_LONG_FOR,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Send the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: !isDev, // secure mode (HTTPS) in production
      sameSite: isDev ? "lax" : "none",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: '/', // Ensure the cookie is available globally
    });
    console.log("User logged in:", user.username);
    res.status(200).json({ message: "Đăng nhập thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ." });
    console.log("Error logging in user:", error);
  }
};

// Logout user by clearing the JWT cookie
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: !isDev, // secure mode (HTTPS) in production
    sameSite: isDev ? "lax" : "none",
    path: '/', // Ensure the cookie is available globally
  });
  res.status(200).json({ message: "Đã đăng xuất." });
};
