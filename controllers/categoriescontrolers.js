// Fayl nomi: controllers/categoriescontrollers.js

// Category modelini chaqirish (bu orqali DB operatsiyalari bajariladi)
const CategoryModel = require("../models/categories");

// --- 1. Yangi kategoriya yaratish (POST /api/categories/add) ---
exports.createCategory = (req, res) => {
  const { name, images } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Kategoriya nomi (name) shart." });
  }

  const categoryData = { name, images };

  CategoryModel.create(categoryData, (err, categoryId) => {
    if (err) {
      // Agar nom noyob bo'lmasa (UNIQUE constraint xatosi)
      if (err.message.includes("UNIQUE constraint failed")) {
        return res
          .status(409)
          .json({ message: "Bu nomdagi kategoriya allaqachon mavjud." });
      }
      return res
        .status(500)
        .json({ message: "Kategoriyani yaratishda xato.", error: err.message });
    }
    res.status(201).json({
      message: "Kategoriya muvaffaqiyatli yaratildi.",
      id: categoryId,
    });
  });
};

// --- 2. Barcha kategoriyalarni olish (GET /api/categories/all) ---
exports.getAllCategories = (req, res) => {
  CategoryModel.getAll((err, categories) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Kategoriyalarni olishda xato.", error: err.message });
    }
    res.status(200).json(categories);
  });
};

// --- 3. Bitta kategoriyani ID bo'yicha olish (GET /api/categories/:id) ---
exports.getCategoryById = (req, res) => {
  const id = req.params.id;

  CategoryModel.getById(id, (err, category) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Kategoriyani olishda xato.", error: err.message });
    }
    if (!category) {
      return res.status(404).json({ message: "Kategoriya topilmadi." });
    }
    res.status(200).json(category);
  });
};

// --- 4. Kategoriyani yangilash (PUT /api/categories/:id) ---
exports.updateCategory = (req, res) => {
  const id = req.params.id;
  const { name, images } = req.body;

  if (!name && !images) {
    return res.status(400).json({
      message: "Yangilash uchun kamida bir maydon kiritilishi shart.",
    });
  }

  // Model faqat o'zgargan qiymatlarni kiritish uchun name va images ni talab qiladi
  const categoryData = { name, images };

  CategoryModel.update(id, categoryData, (err, changes) => {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res
          .status(409)
          .json({ message: "Bu nomdagi kategoriya allaqachon mavjud." });
      }
      return res.status(500).json({
        message: "Kategoriyani yangilashda xato.",
        error: err.message,
      });
    }
    if (changes === 0) {
      return res
        .status(404)
        .json({ message: "Kategoriya topilmadi yoki o'zgarish kiritilmadi." });
    }
    res.status(200).json({ message: "Kategoriya muvaffaqiyatli yangilandi." });
  });
};

// --- 5. Kategoriyani o'chirish (DELETE /api/categories/:id) ---
exports.deleteCategory = (req, res) => {
  const id = req.params.id;

  CategoryModel.delete(id, (err, changes) => {
    if (err) {
      return res.status(500).json({
        message: "Kategoriyani o'chirishda xato.",
        error: err.message,
      });
    }
    if (changes === 0) {
      return res.status(404).json({ message: "Kategoriya topilmadi." });
    }
    res.status(200).json({ message: "Kategoriya muvaffaqiyatli o'chirildi." });
  });
};
