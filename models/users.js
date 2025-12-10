const db = require("../config/db");

class UserModel {
  // Jadvalni yaratish funksiyasi
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
    db.run(sql, (err) => {
      if (err) {
        console.error("Jadval yaratishda xato:", err.message);
      } else {
        console.log("Jadval muvaffaqiyatli yaratildi (yoki mavjud).");
      }
      if (callback) callback(err);
    });
  }

  // Yangi foydalanuvchini bazaga qo'shish (Register)
  static create(userData, callback) {
    const { username, first_name, email, password, role = "user" } = userData;
    const sql =
      "INSERT INTO users (username, first_name, email, password, role) VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [username, first_name, email, password, role], function (err) {
      callback(err, this ? this.lastID : null);
    });
  }

  // Username orqali foydalanuvchini topish (Login)
  static findByUsername(username, callback) {
    const sql = "SELECT * FROM users WHERE username = ?";
    db.get(sql, [username], (err, row) => {
      callback(err, row);
    });
  }

  // ID orqali foydalanuvchini topish (userme)
  static findById(id, callback) {
    // Parol maydonini chiqarib tashladik
    const sql =
      "SELECT id, username, first_name, email, role FROM users WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      callback(err, row);
    });
  }
}

module.exports = UserModel;
