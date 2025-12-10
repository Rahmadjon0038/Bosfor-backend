const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontroller");
const authMiddleware = require("../middleware/authmiddleware");

// GET /api/user/me - Faqat token yuborilganida ishlaydi
router.get("/me", authMiddleware, userController.getMe);

module.exports = router;
