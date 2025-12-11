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
// 1. POST products/add
//==============================
/**
 * @swagger
 * /products/add:
 *   post:
 *     summary: Yangi mahsulot yaratish (Admin talab qilinadi mumkin)
 *     tags: [Products]
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
 *                 description: Rasm URL'lar massivi
 *               isliked:
 *                 type: boolean
 *                 example: true
 *               category_id:
 *                 type: integer
 *                 description: Mahsulot bog'langan kategoriya IDsi
 *     responses:
 *       201:
 *         description: Mahsulot muvaffaqiyatli yaratildi
 *       400:
 *         description: Talab qilingan maydonlar to'ldirilmagan yoki noto'g'ri category_id
 *       401:
 *         description: Autentifikatsiya xatosi
 */
router.post("/add", authMiddleware, productControllers.createProduct);

//==============================
// 2. GET products/all
//==============================
/**
 * @swagger
 * /products/all:
 *   get:
 *     summary: Barcha mahsulotlarni kategoriyasi bilan olish
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Mahsulotlar ro'yxati muvaffaqiyatli olindi
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
 *                     example: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
 *                   isliked: { type: boolean, example: false }
 *                   category_id: { type: integer, example: 1 }
 *                   category_name: { type: string, example: "Kurtkalar va svitrlar" }
 *       500:
 *         description: Server xatosi
 */
router.get("/all", productControllers.getAllProducts);

//==============================
// 3. GET products/{id}
//==============================
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: ID bo'yicha bitta mahsulotni olish
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Mahsulotning ID raqami
 *     responses:
 *       200:
 *         description: Mahsulot ma'lumotlari muvaffaqiyatli olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer, example: 15 }
 *                 name: { type: string, example: "Yozgi fudbolka" }
 *                 price: { type: integer, example: 125000 }
 *                 count: { type: integer, example: 60 }
 *                 images:
 *                   type: array
 *                   items: { type: string }
 *                   example: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
 *                 isliked: { type: boolean, example: false }
 *                 category_id: { type: integer, example: 1 }
 *                 category_name: { type: string, example: "Kurtkalar va svitrlar" }
 *       404:
 *         description: Mahsulot topilmadi
 */
router.get("/:id", productControllers.getProductById);

//==============================
// 4. PUT products/{id}
//==============================
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: ID bo'yicha mahsulotni yangilash (Admin talab qilinishi mumkin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Yangilanadigan mahsulotning ID raqami
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Yozgi Fudbolka V2" }
 *               price: { type: integer, example: 130000 }
 *               category_id: { type: integer, example: 2 }
 *     responses:
 *       200:
 *         description: Mahsulot muvaffaqiyatli yangilandi
 *       401:
 *         description: Autentifikatsiya xatosi
 *       404:
 *         description: Mahsulot topilmadi
 */
router.put("/:id", authMiddleware, productControllers.updateProduct);

//==============================
// 5. DELETE products/{id}
//==============================
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: ID bo'yicha mahsulotni o'chirish (Admin talab qilinishi mumkin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O'chiriladigan mahsulotning ID raqami
 *     responses:
 *       200:
 *         description: Mahsulot muvaffaqiyatli o'chirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Mahsulot muvaffaqiyatli o'chirildi." }
 *       401:
 *         description: Autentifikatsiya xatosi
 *       404:
 *         description: Mahsulot topilmadi
 */
router.delete("/:id", authMiddleware, productControllers.deleteProduct);

module.exports = router;
