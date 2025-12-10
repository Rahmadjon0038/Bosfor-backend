const express = require("express");

// Routerlar va Modelni import qilish (Fayl nomlariga e'tibor bering!)
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const UserModel = require("./models/users"); // Sizning fayl nomingiz: users.js

// Swagger UI uchun qismlar (Agar foydalansangiz)
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./config/swagger.config');

const app = express();
const PORT = 3000;

// Middleware'lar
app.use(express.json());

// 1. Jadvalni yaratishni ta'minlash va serverni ishga tushirish
UserModel.initializeTable((err) => {
  if (err) {
    console.error(
      "DB inicializatsiyasida halokatli xato, server ishga tushmaydi."
    );
    // Xatolik bo'lsa, chiqib ketish
    return;
  }

  // DB tayyor bo'lgandan keyin yo'nalishlarni ulash

  // 2. Yo'nalishlarni (Routes) ulash
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);

  // Swagger hujjatlash endpointini qo'shish (Agar o'rnatilgan bo'lsa)
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Asosiy sahifa testi
  app.get("/", (req, res) => {
    res.send("Node.js Express SQLite3 Backend ishlamoqda.");
  });

  // 3. Serverni tinglashni boshlash
  app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} manzilida ishga tushdi.`);
  });
});
