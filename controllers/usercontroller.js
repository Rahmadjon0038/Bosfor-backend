const UserModel = require("../models/users");

// Token orqali kirgan foydalanuvchi ma'lumotlarini qaytarish
exports.getMe = (req, res) => {
  // req.user ma'lumotlari authMiddleware orqali token ichidan olinadi
  const userId = req.user.id;

  UserModel.findById(userId, (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Server xatosi", error: err.message });
    }

    if (!user) {
      // Token valid, lekin user bazada topilmadi
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    // UserModel.findById faqat kerakli ma'lumotlarni qaytaradi
    res.json(user);
  });
};
