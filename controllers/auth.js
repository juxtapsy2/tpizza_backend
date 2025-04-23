import crypto from "crypto";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import sendEmail from "../utils/sendEmail.js";

const isDev = process.env.NODE_ENV !== "production";
const backendURL = isDev ? "http://localhost:8800" : process.env.BACKEND_URL;
const frontendURL = isDev? "http://localhost:3000" : process.env.FRONTEND_URL;

export const sendVerificationEmail = async (to, token) => {
  const url = `${frontendURL}/verify-email?token=${token}`;

  await sendEmail({
    from: '"TPizza 🍕" <frost.death.ap@gmail.com>',
    to,
    subject: "Xác minh tài khoản TPizza của bạn",
    html: `
      <h3>Chào mừng đến với TPizza!</h3>
      <p>Nhấn vào liên kết dưới đây để xác minh email của bạn:</p>
      <a href="${url}" style="padding:10px 20px;background:#22c55e;color:white;border-radius:8px;text-decoration:none;">Xác minh Email</a>
      <p>Nếu bạn không tạo tài khoản này, hãy bỏ qua email này.</p>
    `,
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
    const verificationUrl = `${backendURL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({ message: "Đăng ký thành công. Vui lòng kiểm tra email của bạn để xác minh tài khoản." });
    console.log("Đăng ký người dùng thành công: ", user.username);
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

  console.log("Người dùng xác thực email thành công:", user.email);
  res.status(200).json({ message: "Xác minh email thành công!" });
};

// Login user and generate JWT
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không chính xác." });
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
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Send the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production with HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1h
    });

    res.status(200).json({ message: "Đăng nhập thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ." });
    console.log("Error logging in user:", error);
  }
};

// Logout user by clearing the JWT cookie
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Đã đăng xuất." });
};
