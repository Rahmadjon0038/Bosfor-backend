/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autentifikatsiya operatsiyalari (Ro'yxatdan o'tish, Kirish)
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontrollers");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Yangi foydalanuvchini ro'yxatdan o'tkazish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - first_name
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               first_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *     responses:
 *       201:
 *         description: Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi
 *       400:
 *         description: Talab qilingan maydonlar to'ldirilmagan
 *       409:
 *         description: Username yoki email band qilingan
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Tizimga kirish va JWT token olish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli kirish
 *       400:
 *         description: Username yoki parol kiritilmagan
 *       401:
 *         description: Username yoki parol noto'g'ri
 */
router.post("/login", authController.login);

module.exports = router;
