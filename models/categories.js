// Fayl nomi: models/categories.js

const db = require("../config/db"); // Ulanishni db.js dan olamiz

const CategoryModel = {
  /**
   * categories jadvalini yaratadi, agar u mavjud bo'lmasa.
   */
  initializeTable: (callback) => {
    try {
      db.exec(`
                CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    images TEXT 
                );
            `);
      console.log("Categories jadvali muvaffaqiyatli yaratildi (yoki mavjud).");
      callback(null);
    } catch (err) {
      console.error("Categories jadvalini yaratishda xato:", err.message);
      callback(err);
    }
  },

  // ... (Qolgan create, getAll, getById, update, delete funksiyalari avvalgidek qoladi)
  create: (categoryData, callback) => {
    try {
      const stmt = db.prepare(
        "INSERT INTO categories (name, images) VALUES (?, ?)"
      );
      const info = stmt.run(categoryData.name, categoryData.images || "");
      callback(null, info.lastInsertRowid);
    } catch (err) {
      callback(err);
    }
  },
  getAll: (callback) => {
    try {
      const stmt = db.prepare("SELECT * FROM categories");
      const categories = stmt.all();
      callback(null, categories);
    } catch (err) {
      callback(err);
    }
  },
  getById: (id, callback) => {
    try {
      const stmt = db.prepare("SELECT * FROM categories WHERE id = ?");
      const category = stmt.get(id);
      callback(null, category);
    } catch (err) {
      callback(err);
    }
  },
  update: (id, categoryData, callback) => {
    try {
      const stmt = db.prepare(
        "UPDATE categories SET name = ?, images = ? WHERE id = ?"
      );
      const info = stmt.run(categoryData.name, categoryData.images || "", id);
      callback(null, info.changes);
    } catch (err) {
      callback(err);
    }
  },
  delete: (id, callback) => {
    try {
      const stmt = db.prepare("DELETE FROM categories WHERE id = ?");
      const info = stmt.run(id);
      callback(null, info.changes);
    } catch (err) {
      callback(err);
    }
  },
};

module.exports = CategoryModel;
