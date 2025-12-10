const sqlite3 = require("sqlite3").verbose();
const DB_PATH = "./users.db"; // users.db fayl nomi

// Ma'lumotlar bazasiga ulanish
const db = new sqlite3.Database(
  DB_PATH,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Ma'lumotlar bazasi ulanishida xato:", err.message);
    } else {
      console.log("SQLite3 ma'lumotlar bazasiga muvaffaqiyatli ulanildi.");
    }
  }
);

module.exports = db;
