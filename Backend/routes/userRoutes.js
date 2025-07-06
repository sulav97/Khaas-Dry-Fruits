const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

// User profile
router.get("/profile", auth, userController.getProfile);
router.put("/profile", auth, userController.updateProfile);

// Admin: get all users, block/unblock
router.get("/", auth, userController.getAllUsers);
router.patch("/:id/block", auth, userController.blockUser);
router.patch("/:id/unblock", auth, userController.unblockUser);

module.exports = router; 