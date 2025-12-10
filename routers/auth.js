const express = require("express");
const router = express.Router();
// Controller fayl nomini to'g'ri import qilish
const authController = require("../controllers/authcontrollers");

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

module.exports = router;
