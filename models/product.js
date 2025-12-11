// Fayl nomi: models/products.js

const db = require("../config/db"); // DB ulanishini chaqiramiz

const ProductModel = {
  /**
   * products jadvalini yaratadi. category_id orqali categories jadvaliga bog'lanadi.
   */
  initializeTable: (callback) => {
    try {
      db.exec(`
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    price INTEGER NOT NULL,
                    count INTEGER DEFAULT 0,
                    images TEXT,  -- Rasm URL'lari JSON stringi sifatida saqlanadi
                    isliked BOOLEAN DEFAULT 0,
                    category_id INTEGER NOT NULL, 
                    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
                );
            `);
      console.log("Products jadvali muvaffaqiyatli yaratildi (yoki mavjud).");
      callback(null);
    } catch (err) {
      console.error("Products jadvalini yaratishda xato:", err.message);
      callback(err);
    }
  },

  /**
   * Yangi mahsulot qo'shish.
   */
  create: (productData, callback) => {
    try {
      // images Array bo'lgani uchun uni DBga yozishdan oldin JSON stringiga aylantiramiz
      const imagesJson = JSON.stringify(productData.images || []);

      const stmt = db.prepare(
        "INSERT INTO products (name, price, count, images, isliked, category_id) VALUES (?, ?, ?, ?, ?, ?)"
      );
      const info = stmt.run(
        productData.name,
        productData.price,
        productData.count,
        imagesJson,
        productData.isliked ? 1 : 0,
        productData.category_id
      );
      callback(null, info.lastInsertRowid);
    } catch (err) {
      callback(err);
    }
  },

  /**
   * Barcha mahsulotlarni olish. Kategoriyani ham biriktirib qaytaradi.
   */
  getAll: (callback) => {
    try {
      const stmt = db.prepare(`
                SELECT p.*, c.name AS category_name 
                FROM products p
                JOIN categories c ON p.category_id = c.id
            `);
      const products = stmt.all();

      // isliked ni boolean va images ni Array formatiga o'tkazamiz
      const formattedProducts = products.map((p) => ({
        ...p,
        isliked: !!p.isliked,
        images: JSON.parse(p.images),
      }));

      callback(null, formattedProducts);
    } catch (err) {
      callback(err);
    }
  },

  /**
   * ID bo'yicha bitta mahsulotni olish.
   */
  getById: (id, callback) => {
    try {
      const stmt = db.prepare(`
                SELECT p.*, c.name AS category_name 
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE p.id = ?
            `);
      const product = stmt.get(id);

      if (product) {
        // isliked ni boolean va images ni Array formatiga o'tkazamiz
        product.isliked = !!product.isliked;
        product.images = JSON.parse(product.images);
      }

      callback(null, product);
    } catch (err) {
      callback(err);
    }
  },

  /**
   * Mahsulotni ID bo'yicha yangilash.
   */
  update: (id, productData, callback) => {
    try {
      // Imagesni yangilayotgan bo'lsak, uni JSON stringiga o'tkazamiz
      let imagesJson = productData.images
        ? JSON.stringify(productData.images)
        : undefined;
      let islikedInt =
        productData.isliked !== undefined
          ? productData.isliked
            ? 1
            : 0
          : undefined;

      // Dynamic SQL Query yaratish
      let queryParts = [];
      let params = [];

      if (productData.name !== undefined) {
        queryParts.push("name = ?");
        params.push(productData.name);
      }
      if (productData.price !== undefined) {
        queryParts.push("price = ?");
        params.push(productData.price);
      }
      if (productData.count !== undefined) {
        queryParts.push("count = ?");
        params.push(productData.count);
      }
      if (imagesJson !== undefined) {
        queryParts.push("images = ?");
        params.push(imagesJson);
      }
      if (islikedInt !== undefined) {
        queryParts.push("isliked = ?");
        params.push(islikedInt);
      }
      if (productData.category_id !== undefined) {
        queryParts.push("category_id = ?");
        params.push(productData.category_id);
      }

      if (queryParts.length === 0) {
        return callback(null, 0); // Yangilash uchun ma'lumot yo'q
      }

      const query = `UPDATE products SET ${queryParts.join(", ")} WHERE id = ?`;
      params.push(id);

      const stmt = db.prepare(query);
      const info = stmt.run(...params);
      callback(null, info.changes);
    } catch (err) {
      callback(err);
    }
  },

  /**
   * Mahsulotni ID bo'yicha o'chirish.
   */
  delete: (id, callback) => {
    try {
      const stmt = db.prepare("DELETE FROM products WHERE id = ?");
      const info = stmt.run(id);
      callback(null, info.changes);
    } catch (err) {
      callback(err);
    }
  },
};

module.exports = ProductModel;
