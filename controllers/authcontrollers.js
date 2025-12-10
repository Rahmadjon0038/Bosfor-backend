const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/users");

const JWT_SECRET = "YOUR_SUPER_SECURE_SECRET_KEY_123"; // Middleware'dagi kalit bilan bir xil bo'lishi kerak

// 1. Ro'yxatdan o'tish (Register)
exports.register = (req, res) => {
  const { username, first_name, email, password, role } = req.body;

  if (!username || !first_name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Barcha asosiy maydonlar to'ldirilishi shart!" });
  }

  // Parolni hash qilish
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Parolni hash qilishda xato" });
    }

    const userData = {
      username,
      first_name,
      email,
      password: hashedPassword,
      role, // Agar undefined bo'lsa, model 'user' defaultini oladi
    };

    UserModel.create(userData, (dbErr, userId) => {
      if (dbErr) {
        if (dbErr.message.includes("UNIQUE constraint failed")) {
          return res.status(409).json({
            message: "Ushbu username yoki email allaqachon ro'yxatdan o'tgan.",
          });
        }
        return res.status(500).json({
          message: "Foydalanuvchini yaratishda xato",
          error: dbErr.message,
        });
      }

      res.status(201).json({
        message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi",
        userId: userId,
      });
    });
  });
};

// 2. Tizimga kirish (Login)
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username va parol kiritilishi shart!" });
  }

  UserModel.findByUsername(username, (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Server xatosi" });
    }

    if (!user) {
      return res.status(401).json({ message: "Username yoki parol noto'g'ri" });
    }

    // Parolni solishtirish
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Parolni tekshirishda xato" });
      }

      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Username yoki parol noto'g'ri" });
      }

      // Token yaratish
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" } // Token muddati 1 kun
      );

      res.json({
        message: "Muvaffaqiyatli kirish",
        token: token,
        role: user.role,
      });
    });
  });
};
