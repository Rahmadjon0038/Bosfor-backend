// Fayl nomi: controllers/productscontrollers.js (Tuzatilgan va to'liq)

const ProductModel = require("../models/product");

// --- 1. createProduct, 2. getAllProducts, 3. getProductById, 4. updateProduct, 5. deleteProduct,
// 6. getProductsByCategoryId, 7. getLikedProducts funksiyalari o'zgarishsiz qoladi

// --- 1. Yangi mahsulot yaratish (POST /api/products/add) ---
exports.createProduct = (req, res) => {
  const { name, price, count, images, category_id } = req.body;

  const islikedValue =
    req.body.isliked !== undefined ? !!req.body.isliked : false;
  const incartValue = req.body.incart !== undefined ? !!req.body.incart : false;

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
    isliked: islikedValue,
    incart: incartValue,
    category_id,
  };

  ProductModel.create(productData, (err, productId) => {
    if (err) {
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
  const { name, price, count, images, isliked, incart, category_id } = req.body;

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
  if (isliked !== undefined) updates.isliked = !!isliked;
  if (incart !== undefined) updates.incart = !!incart;
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

// --- 6. Category ID bo'yicha mahsulotlarni olish (GET /api/products/category/:categoryId) ---
exports.getProductsByCategoryId = (req, res) => {
  const categoryId = req.params.categoryId;

  if (isNaN(parseInt(categoryId))) {
    return res
      .status(400)
      .json({ message: "Noto'g'ri kategoriya ID formati." });
  }

  ProductModel.findByCategoryId(categoryId, (err, products) => {
    if (err) {
      return res.status(500).json({
        message: "Mahsulotlarni kategoriya bo'yicha olishda xato.",
        error: err.message,
      });
    }
    res.status(200).json(products);
  });
};

// --- 7. Faqat yoqtirilgan mahsulotlarni olish (GET /api/products/liked) ---
exports.getLikedProducts = (req, res) => {
  ProductModel.getLikedProducts((err, products) => {
    if (err) {
      return res.status(500).json({
        message: "Yoqtirilgan mahsulotlarni olishda xato.",
        error: err.message,
      });
    }
    res.status(200).json(products);
  });
};

// --- 8. Mahsulotning "isliked" holatini yangilash (PATCH /api/products/like/:id) ---
exports.toggleLikedStatus = (req, res) => {
  const id = req.params.id;
  const { isliked } = req.body;

  if (isliked === undefined || typeof isliked !== "boolean") {
    return res
      .status(400)
      .json({ message: "Liked holatini (true/false) yuborish shart." });
  }

  const updates = { isliked };

  ProductModel.update(id, updates, (err, changes) => {
    if (err) {
      return res.status(500).json({
        message: "Liked holatini yangilashda xato.",
        error: err.message,
      });
    }
    if (changes === 0) {
      return res
        .status(404)
        .json({ message: "Mahsulot topilmadi yoki holat o'zgarmadi." });
    }
    res.status(200).json({
      message: `Mahsulot muvaffaqiyatli ${
        isliked ? "yoqtirildi" : "yoqtirilganlardan olindi"
      }.`,
      isliked: isliked,
    });
  });
};

// --- 9. Mahsulotning "incart" holatini yangilash (PATCH /api/products/cart/:id) ---
exports.toggleCartStatus = (req, res) => {
  const id = req.params.id;
  const { incart } = req.body;

  if (incart === undefined || typeof incart !== "boolean") {
    return res
      .status(400)
      .json({ message: "Savat holatini (true/false) yuborish shart." });
  }

  const updates = { incart };

  ProductModel.update(id, updates, (err, changes) => {
    if (err) {
      return res.status(500).json({
        message: "Savat holatini yangilashda xato.",
        error: err.message,
      });
    }
    if (changes === 0) {
      return res
        .status(404)
        .json({ message: "Mahsulot topilmadi yoki holat o'zgarmadi." });
    }
    res.status(200).json({
      message: `Mahsulot muvaffaqiyatli ${
        incart ? "savatga qo'shildi" : "savatdan chiqarildi"
      }.`,
      incart: incart,
    });
  });
};

// --- 10. Savatdagi mahsulotlarni olish (GET /api/products/cart) --- ⬅️ YANGI CONTROLLER
exports.getCartProducts = (req, res) => {
  ProductModel.getCartProducts((err, products) => {
    if (err) {
      return res.status(500).json({
        message: "Savatdagi mahsulotlarni olishda xato.",
        error: err.message,
      });
    }
    res.status(200).json(products);
  });
};
