const Database = require("better-sqlite3");
const DB_PATH = "./users.db"; // users.db fayl nomi

let db;

try {
  // Better SQLite3 sinxron ulanishni yaratish
  // verbose: xato xabarlarini to'liq chiqarish uchun
  db = new Database(DB_PATH, { verbose: console.log });
  console.log("Better SQLite3 ma'lumotlar bazasiga muvaffaqiyatli ulanildi.");
} catch (error) {
  console.error(
    "Better SQLite3 ma'lumotlar bazasi ulanishida xato:",
    error.message
  );
  // Kritk xato bo'lsa, jarayonni to'xtatish
  process.exit(1);
}

module.exports = db;
