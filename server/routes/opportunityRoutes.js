const express = require("express");
const router = express.Router();
const {
  getOpportunities,
  getOpportunity,
  applyToOpportunity,
} = require("../controllers/opportunityController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getOpportunities);
router.get("/:id", getOpportunity);
router.post("/:id/apply", protect, applyToOpportunity);

module.exports = router;
