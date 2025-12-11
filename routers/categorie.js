/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Mahsulot kategoriyalarini boshqarish (CRUD)
 */

const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/categoriescontrolers");
const authMiddleware = require("../middleware/authmiddleware");

//==============================
// 1. POST /categories/add
//==============================

/**
 * @swagger
 * /categories/add:
 *   post:
 *     summary: Yangi kategoriya yaratish
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Kurtkalar"
 *               images:
 *                 type: string
 *                 example: "https://example.com/images/kurtka.jpg"
 *     responses:
 *       201:
 *         description: Kategoriya muvaffaqiyatli yaratildi
 *       400:
 *         description: Talab qilingan maydonlar to‘ldirilmagan
 *       401:
 *         description: Token noto‘g‘ri
 *       409:
 *         description: Bu nomdagi kategoriya mavjud
 */
router.post("/add", authMiddleware, categoryControllers.createCategory);

//==============================
// 2. GET /categories/all
//==============================

/**
 * @swagger
 * /categories/all:
 *   get:
 *     summary: Barcha kategoriyalarni olish
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Kategoriyalar ro‘yxati
 *       500:
 *         description: Server xatosi
 */
router.get("/all", categoryControllers.getAllCategories);

//==============================
// 3. GET /categories/{id}
//==============================

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: ID bo‘yicha kategoriya olish
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kategoriya ma‘lumotlari
 *       404:
 *         description: Kategoriya topilmadi
 */
router.get("/:id", categoryControllers.getCategoryById);

//==============================
// 4. PUT /categories/{id}
//==============================

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Kategoriyani yangilash
 *     tags: [Categories]
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
 *               name:
 *                 type: string
 *                 example: "Kurtkalar 2025"
 *               images:
 *                 type: string
 *                 example: "https://example.com/new_image.jpg"
 *     responses:
 *       200:
 *         description: Kategoriya yangilandi
 *       401:
 *         description: Token yo‘q yoki noto‘g‘ri
 *       404:
 *         description: Kategoriya topilmadi
 *       409:
 *         description: Bu nomdagi kategoriya mavjud
 */
router.put("/:id", authMiddleware, categoryControllers.updateCategory);

//==============================
// 5. DELETE /categories/{id}
//==============================

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Kategoriyani o‘chirish
 *     tags: [Categories]
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
 *         description: Kategoriya o‘chirildi
 *       401:
 *         description: Token xato
 *       404:
 *         description: Kategoriya topilmadi
 */
router.delete("/:id", authMiddleware, categoryControllers.deleteCategory);

module.exports = router;
