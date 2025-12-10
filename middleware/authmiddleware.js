const jwt = require("jsonwebtoken");

// Tokenni sirlash uchun kalit
const JWT_SECRET = "YOUR_SUPER_SECURE_SECRET_KEY_123";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Avtorizatsiya tokeni topilmadi" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token taqdim etilmagan" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Token ichidagi foydalanuvchi ma'lumotlarini req.user ga yuklaymiz
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token yaroqsiz yoki muddati o'tgan" });
  }
};

module.exports = authMiddleware;
