/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Foydalanuvchi profil ma'lumotlari
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontroller");
const authMiddleware = require("../middleware/authmiddleware");

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Token orqali kirgan foydalanuvchining shaxsiy ma'lumotlarini olish
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil ma'lumotlari muvaffaqiyatli olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                 username:
 *                   type: string
 *                   example: "testuser"
 *                 first_name:
 *                   type: string
 *                   example: "Ali"
 *                 email:
 *                   type: string
 *                   example: "ali@example.com"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       401:
 *         description: Autentifikatsiya xatosi (Token yo'q yoki noto'g'ri)
 *       404:
 *         description: Foydalanuvchi topilmadi
 *       500:
 *         description: Server xatosi
 */

router.get("/me", authMiddleware, userController.getMe);

module.exports = router;
