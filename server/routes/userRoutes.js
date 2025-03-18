const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAppliedOpportunities,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/applied-opportunities", protect, getAppliedOpportunities);

module.exports = router;
