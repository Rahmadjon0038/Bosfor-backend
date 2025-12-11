const express = require("express");
const cors = require("cors");
// Routerlar va Modelni import qilish
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const UserModel = require("./models/users");
const CategoryModel = require("./models/categories");
const ProductModel = require("./models/product"); // ⬅️ Model nomi 'products' deb to'g'rilandi.

const categoryRouter = require("./routers/categorie"); // ⬅️ Router nomi 'categories' deb to'g'rilandi.
const productRouter = require("./routers/products"); // ⬅️ Product Routeri qo'shildi!

// --- Swagger UI uchun qismlarni izohdan chiqarish ---
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.config");
// ----------------------------------------------------

const app = express();
const PORT = 3000;

// Middleware'lar
app.use(express.json());
app.use(cors());

// 1. Jadvalni yaratishni ta'minlash va serverni ishga tushirish (Chaqirish zanjiri)
UserModel.initializeTable((err) => {
  if (err) {
    console.error(
      "DB inicializatsiyasida halokatli xato (Users jadvali). Server ishga tushmaydi."
    );
    return;
  }

  // ⬅️ 2. Users dan keyin Categories jadvalini yaratish
  CategoryModel.initializeTable((catErr) => {
    if (catErr) {
      console.error(
        "DB inicializatsiyasida halokatli xato (Categories jadvali). Server ishga tushmaydi."
      );
      return;
    }

    // ⬅️ 3. Categories dan keyin Products jadvalini yaratish
    ProductModel.initializeTable((prodErr) => {
      // ⬅️ YANGI QISM!
      if (prodErr) {
        console.error(
          "DB inicializatsiyasida halokatli xato (Products jadvali). Server ishga tushmaydi."
        );
        return;
      }

      // DB tayyor bo'lgandan keyin yo'nalishlarni ulash

      // 2. Yo'nalishlarni (Routes) ulash
      app.use("/api/auth", authRouter);
      app.use("/api/user", userRouter);

      // -------------------CATEGORY ROUTER ---------
      app.use("/api/categories", categoryRouter);

      // -------------------PRODUCT ROUTER ---------
      app.use("/api/products", productRouter); // ⬅️ YANGI ROUTER ULANISHI!

      // --- Swagger hujjatlash endpointini qo'shish ---
      app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
      // ------------------------------------------------

      // Asosiy sahifa testi
      app.get("/", (req, res) => {
        res.send("Node.js Express SQLite3 Backend ishlamoqda.");
      });

      // 3. Serverni tinglashni boshlash
      app.listen(PORT, () => {
        console.log(`Server http://localhost:${PORT} manzilida ishga tushdi.`);
        console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
      });
    }); // ProductModel.initializeTable tugadi
  }); // CategoryModel.initializeTable tugadi
}); // UserModel.initializeTable tugadi
