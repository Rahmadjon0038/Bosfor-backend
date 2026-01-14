// Fayl nomi: routers/products.js (TO'LIQ TUZATILGAN)

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Mahsulotlarni boshqarish (CRUD)
 */

const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productscontrollers");
const authMiddleware = require("../middleware/authmiddleware");

//==============================
// 1. POST /products/add
//==============================
/**
 * @swagger
 * /products/add:
 *   post:
 *     summary: Yangi mahsulot yaratish (Admin talab qilinadi)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category_id
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Qishki palto"
 *               price:
 *                 type: integer
 *                 example: 850000
 *               count:
 *                 type: integer
 *                 example: 15
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Rasm URL'lar ro'yxati
 *               isliked:
 *                 type: boolean
 *                 example: true
 *               incart:
 *                 type: boolean
 *                 example: false
 *               category_id:
 *                 type: integer
 *                 description: Mahsulot bog'langan kategoriya IDsi
 *     responses:
 *       201:
 *         description: Mahsulot muvaffaqiyatli yaratildi
 *       400:
 *         description: Noto'g'ri maydon yoki category_id xatosi
 *       401:
 *         description: Autentifikatsiya xatosi
 */
router.post("/add", authMiddleware, productControllers.createProduct);

//==============================
// 2. GET /products/all
//==============================
/**
 * @swagger
 * /products/all:
 *   get:
 *     summary: Barcha mahsulotlarni kategoriyasi bilan olish
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Mahsulotlar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer, example: 15 }
 *                   name: { type: string, example: "Yozgi fudbolka" }
 *                   price: { type: integer, example: 125000 }
 *                   count: { type: integer, example: 60 }
 *                   images:
 *                     type: array
 *                     items: { type: string }
 *                   isliked: { type: boolean, example: false }
 *                   incart: { type: boolean, example: false }
 *                   category_id: { type: integer, example: 1 }
 *                   category_name: { type: string, example: "Kurtkalar va svitrlar" }
 *       500:
 *         description: Server xatosi
 */
router.get("/all", productControllers.getAllProducts);

//==============================
// 3. GET /products/liked
//==============================
/**
 * @swagger
 * /products/liked:
 *   get:
 *     summary: Faqat isliked=true bo'lgan mahsulotlarni olish
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Yoqtirilgan mahsulotlar ro'yxati
 *       500:
 *         description: Server xatosi
 */
router.get("/liked", productControllers.getLikedProducts);

//==============================
// 4. GET /products/cart
//==============================
/**
 * @swagger
 * /products/cart:
 *   get:
 *     summary: Faqat incart=true bo'lgan (savatdagi) mahsulotlarni olish
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Savatdagi mahsulotlar ro'yxati
 *       500:
 *         description: Server xatosi
 */
router.get("/cart", productControllers.getCartProducts);

//==============================
// 5. GET /products/{id}
//==============================
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: ID bo'yicha bitta mahsulotni olish
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Mahsulotning ID raqami
 *     responses:
 *       200:
 *         description: Mahsulot ma'lumotlari
 *       404:
 *         description: Mahsulot topilmadi
 */
router.get("/:id", productControllers.getProductById);

//==============================
// 4. PUT /products/{id}
//==============================
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: ID bo'yicha mahsulotni yangilash
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Yozgi Fudbolka V2" }
 *               price: { type: integer, example: 130000 }
 *               incart: { type: boolean, example: true }
 *               isliked: { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Mahsulot yangilandi
 *       401:
 *         description: Autentifikatsiya xatosi
 *       404:
 *         description: Mahsulot topilmadi
 */
router.put("/:id", authMiddleware, productControllers.updateProduct);

//==============================
// 5. DELETE /products/{id}
//==============================
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: ID bo'yicha mahsulotni o'chirish
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mahsulot muvaffaqiyatli o'chirildi
 *       404:
 *         description: Mahsulot topilmadi
 */
router.delete("/:id", authMiddleware, productControllers.deleteProduct);

//==============================
// 6. GET /products/category/{categoryId}
//==============================
/**
 * @swagger
 * /products/category/{categoryId}:
 *   get:
 *     summary: Category ID bo'yicha mahsulotlarni olish
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Filterlanadigan kategoriya IDsi
 *     responses:
 *       200:
 *         description: Filterlangan mahsulotlar
 *       400:
 *         description: Noto'g'ri ID formati
 */
router.get("/category/:categoryId", productControllers.getProductsByCategoryId);

//==============================
// 8. PATCH /products/like/{id}
//==============================
/**
 * @swagger
 * /products/like/{id}:
 *   patch:
 *     summary: Mahsulotning 'isliked' holatini yangilash (Like/Unlike)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isliked
 *             properties:
 *               isliked:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Holat muvaffaqiyatli yangilandi
 *       404:
 *         description: Mahsulot topilmadi
 */
router.patch("/like/:id", productControllers.toggleLikedStatus);

//==============================
// 9. PATCH /products/cart/{id}
//==============================
/**
 * @swagger
 * /products/cart/{id}:
 *   patch:
 *     summary: Mahsulotning 'incart' holatini yangilash (Savatga qo'shish/chiqarish)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - incart
 *             properties:
 *               incart:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Holat muvaffaqiyatli yangilandi
 *       404:
 *         description: Mahsulot topilmadi
 */
router.patch("/cart/:id", productControllers.toggleCartStatus);

module.exports = router;
