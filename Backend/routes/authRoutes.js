const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware"); // ✅ Auth middleware

// Register route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

// ✅ Current user route - returns logged-in user info from token
router.get("/me", auth, (req, res) => {
  const { _id, name, email, isAdmin } = req.user;
  res.json({
    id: _id,
    name,
    email,
    isAdmin
  });
});

module.exports = router;
