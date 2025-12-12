// Fayl nomi: models/products.js (Tuzatilgan va to'liq)

const db = require("../config/db");

const ProductModel = {
  initializeTable: (callback) => {
    try {
      db.exec(`
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    price INTEGER NOT NULL,
                    count INTEGER DEFAULT 0,
                    images TEXT,  
                    isliked BOOLEAN DEFAULT 0,
                    incart BOOLEAN DEFAULT 0,
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

  create: (productData, callback) => {
    try {
      const imagesJson = JSON.stringify(productData.images || []);

      const stmt = db.prepare(
        "INSERT INTO products (name, price, count, images, isliked, incart, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
      );
      const info = stmt.run(
        productData.name,
        productData.price,
        productData.count,
        imagesJson,
        productData.isliked ? 1 : 0,
        productData.incart ? 1 : 0,
        productData.category_id
      );
      callback(null, info.lastInsertRowid);
    } catch (err) {
      callback(err);
    }
  },

  getAll: (callback) => {
    try {
      const stmt = db.prepare(`
                SELECT p.*, c.name AS category_name 
                FROM products p
                JOIN categories c ON p.category_id = c.id
            `);
      const products = stmt.all();

      const formattedProducts = products.map((p) => ({
        ...p,
        isliked: !!p.isliked,
        incart: !!p.incart,
        images: JSON.parse(p.images),
      }));

      callback(null, formattedProducts);
    } catch (err) {
      callback(err);
    }
  },

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
        product.isliked = !!product.isliked;
        product.incart = !!product.incart;
        product.images = JSON.parse(product.images);
      }

      callback(null, product);
    } catch (err) {
      callback(err);
    }
  },

  /**
   * Mahsulotni ID bo'yicha yangilash.
   * isliked va incart ni raqamga o'tkazishni to'g'rilaymiz.
   */
  update: (id, productData, callback) => {
    try {
      let imagesJson = productData.images
        ? JSON.stringify(productData.images)
        : undefined;

      // isliked ni INT ga o'tkazish
      let islikedInt =
        productData.isliked !== undefined
          ? productData.isliked
            ? 1
            : 0
          : undefined;

      // incart ni INT ga o'tkazish
      let incartInt =
        productData.incart !== undefined
          ? productData.incart
            ? 1
            : 0
          : undefined;

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
        // ⬅️ Yangilanishni kiritish
        queryParts.push("isliked = ?");
        params.push(islikedInt);
      }
      if (incartInt !== undefined) {
        // ⬅️ Yangilanishni kiritish
        queryParts.push("incart = ?");
        params.push(incartInt);
      }
      if (productData.category_id !== undefined) {
        queryParts.push("category_id = ?");
        params.push(productData.category_id);
      }

      if (queryParts.length === 0) {
        return callback(null, 0);
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

  delete: (id, callback) => {
    try {
      const stmt = db.prepare("DELETE FROM products WHERE id = ?");
      const info = stmt.run(id);
      callback(null, info.changes);
    } catch (err) {
      callback(err);
    }
  },

  findByCategoryId: (categoryId, callback) => {
    try {
      const stmt = db.prepare(`
                SELECT p.*, c.name AS category_name 
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE p.category_id = ?
            `);
      const products = stmt.all(categoryId);

      const formattedProducts = products.map((p) => ({
        ...p,
        isliked: !!p.isliked,
        incart: !!p.incart,
        images: JSON.parse(p.images),
      }));

      callback(null, formattedProducts);
    } catch (err) {
      callback(err);
    }
  },

  // Fayl nomi: models/product.js (NAMUNA)

  // ...

  // --- Faqat yoqtirilgan mahsulotlarni olish ---
  getLikedProducts: (callback) => {
    try {
      const stmt = db.prepare(`
            SELECT * FROM products // ⬅️ FAKAT PRODUCTS DAN OLYAPMIZ
            WHERE isliked = 1 // isliked 1 ga teng bo'lgan mahsulotni qidiramiz
        `);
      const products = stmt.all();

      // Kategoriya nomini olib tashlaganimiz uchun formatlashni o'zgartiramiz
      const formattedProducts = products.map((p) => ({
        ...p,
        isliked: !!p.isliked,
        incart: !!p.incart,
        images: JSON.parse(p.images),
        category_name: null, // Test uchun null qoldiramiz
      }));

      callback(null, formattedProducts);
    } catch (err) {
      callback(err);
    }
  },

  // --- Faqat savatdagi mahsulotlarni olish ---
  getCartProducts: (callback) => {
    try {
      const stmt = db.prepare(`
            SELECT * FROM products // ⬅️ FAKAT PRODUCTS DAN OLYAPMIZ
            WHERE incart = 1
        `);
      const products = stmt.all();

      const formattedProducts = products.map((p) => ({
        ...p,
        isliked: !!p.isliked,
        incart: !!p.incart,
        images: JSON.parse(p.images),
        category_name: null,
      }));

      callback(null, formattedProducts);
    } catch (err) {
      callback(err);
    }
  },
};
module.exports = ProductModel;
