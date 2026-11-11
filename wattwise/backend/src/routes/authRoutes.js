const express = require("express");
const router = express.Router();
const { register, login, getMe, searchPenghuni } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.get("/search-penghuni", protect, searchPenghuni);

module.exports = router;
