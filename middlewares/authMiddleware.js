import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập." });
    }

    const decoded = jwt.verify(token, process.env.THE_JWT_KEY_HACKERS_LONG_FOR);
    req.user = decoded;
    next(); // move to the next middleware or controller
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).json({ message: "Phiên đăng nhập không hợp lệ." });
  }
};
