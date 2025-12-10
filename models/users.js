const db = require("../config/db"); // Bu yerda Better SQLite3 ulanishi eksport qilinadi

class UserModel {
  /**
   * Jadvalni yaratish funksiyasi
   * @param {function} callback - server.js bilan moslashish uchun qoldirilgan.
   */
  static initializeTable(callback) {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
      );
    `;

    try {
      // Better SQLite3 da jadval yaratish uchun db.exec() ishlatiladi
      db.exec(sql);
      console.log("Jadval muvaffaqiyatli yaratildi (yoki mavjud).");
      if (callback) callback(null);
    } catch (err) {
      console.error("Jadval yaratishda xato:", err.message);
      // Agar callback mavjud bo'lsa, xatoni qaytaramiz
      if (callback) callback(err);
    }
  }

  /**
   * Yangi foydalanuvchini bazaga qo'shish (Register)
   */
  static create(userData, callback) {
    const { username, first_name, email, password, role = "user" } = userData;
    const sql =
      "INSERT INTO users (username, first_name, email, password, role) VALUES (?, ?, ?, ?, ?)";

    try {
      // Better SQLite3 da INSERT: db.prepare().run() ishlatiladi
      const stmt = db.prepare(sql);
      const info = stmt.run(username, first_name, email, password, role);

      // info.lastInsertRowid - yangi qo'shilgan yozuv ID si
      callback(null, info.lastInsertRowid);
    } catch (err) {
      // UNIQUE constraint xatolari kabi xatolarni ushlash
      callback(err, null);
    }
  }

  /**
   * Username orqali foydalanuvchini topish (Login)
   */
  static findByUsername(username, callback) {
    const sql = "SELECT * FROM users WHERE username = ?";

    try {
      // Better SQLite3 da SELECT bitta yozuv uchun: db.prepare().get() ishlatiladi
      const stmt = db.prepare(sql);
      const row = stmt.get(username);
      // row - user obyekti yoki undefined
      callback(null, row);
    } catch (err) {
      callback(err, null);
    }
  }

  /**
   * ID orqali foydalanuvchini topish (userme)
   */
  static findById(id, callback) {
    // Parol maydonini chiqarib tashladik
    const sql =
      "SELECT id, username, first_name, email, role FROM users WHERE id = ?";

    try {
      const stmt = db.prepare(sql);
      const row = stmt.get(id);
      callback(null, row);
    } catch (err) {
      callback(err, null);
    }
  }
}

module.exports = UserModel;
