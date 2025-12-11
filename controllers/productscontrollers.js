// Fayl nomi: controllers/productscontrollers.js

const ProductModel = require("../models/product");

// --- 1. Yangi mahsulot yaratish (POST /api/products/add) ---
exports.createProduct = (req, res) => {
  // isliked ni req.body dan o'qib olish. Agar u mavjud bo'lmasa, undefined bo'ladi.
  const { name, price, count, images, category_id } = req.body;

  // Klient isliked ni yubormagan bo'lsa, uni avtomatik False (0) qilib belgilaymiz.
  // Agar yuborgan bo'lsa, uni boolean qiymatiga o'tkazamiz.
  const islikedValue =
    req.body.isliked !== undefined ? !!req.body.isliked : false;

  if (!name || !price || !category_id) {
    return res
      .status(400)
      .json({ message: "Mahsulot nomi, narxi va kategoriya IDsi shart." });
  }
  if (!Array.isArray(images)) {
    return res.status(400).json({
      message:
        "Images maydoni URL stringlaridan iborat massiv (Array) bo'lishi kerak.",
    });
  }

  const productData = {
    name,
    price,
    count: count || 0,
    images,
    isliked: islikedValue, // ⬅️ Yangilangan mantiq
    category_id,
  };

  ProductModel.create(productData, (err, productId) => {
    if (err) {
      // Foreign Key xatosini tutish (category_id noto'g'ri bo'lsa)
      if (err.message.includes("FOREIGN KEY constraint failed")) {
        return res
          .status(400)
          .json({ message: "Noto'g'ri Kategoriya IDsi (category_id)." });
      }
      return res
        .status(500)
        .json({ message: "Mahsulotni yaratishda xato.", error: err.message });
    }
    res.status(201).json({
      message: "Mahsulot muvaffaqiyatli yaratildi.",
      id: productId,
    });
  });
};

// --- 2. Barcha mahsulotlarni olish (GET /api/products/all) ---
exports.getAllProducts = (req, res) => {
  ProductModel.getAll((err, products) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Mahsulotlarni olishda xato.", error: err.message });
    }
    res.status(200).json(products);
  });
};

// --- 3. Bitta mahsulotni ID bo'yicha olish (GET /api/products/:id) ---
exports.getProductById = (req, res) => {
  const id = req.params.id;

  ProductModel.getById(id, (err, product) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Mahsulotni olishda xato.", error: err.message });
    }
    if (!product) {
      return res.status(404).json({ message: "Mahsulot topilmadi." });
    }
    res.status(200).json(product);
  });
};

// --- 4. Mahsulotni yangilash (PUT /api/products/:id) ---
exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, price, count, images, isliked, category_id } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (price !== undefined) updates.price = price;
  if (count !== undefined) updates.count = count;
  if (images !== undefined) {
    if (!Array.isArray(images)) {
      return res
        .status(400)
        .json({ message: "Images maydoni Array bo'lishi shart." });
    }
    updates.images = images;
  }
  // isliked kelsa, uni boolean qiymatiga o'tkazamiz
  if (isliked !== undefined) updates.isliked = !!isliked;
  if (category_id !== undefined) updates.category_id = category_id;

  if (Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ message: "Yangilash uchun ma'lumot kiritilishi shart." });
  }

  ProductModel.update(id, updates, (err, changes) => {
    if (err) {
      if (err.message.includes("FOREIGN KEY constraint failed")) {
        return res
          .status(400)
          .json({ message: "Noto'g'ri Kategoriya IDsi (category_id)." });
      }
      return res
        .status(500)
        .json({ message: "Mahsulotni yangilashda xato.", error: err.message });
    }
    if (changes === 0) {
      return res
        .status(404)
        .json({ message: "Mahsulot topilmadi yoki o'zgarish kiritilmadi." });
    }
    res.status(200).json({ message: "Mahsulot muvaffaqiyatli yangilandi." });
  });
};

// --- 5. Mahsulotni o'chirish (DELETE /api/products/:id) ---
exports.deleteProduct = (req, res) => {
  const id = req.params.id;

  ProductModel.delete(id, (err, changes) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Mahsulotni o'chirishda xato.", error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ message: "Mahsulot topilmadi." });
    }
    res.status(200).json({ message: "Mahsulot muvaffaqiyatli o'chirildi." });
  });
};
