const User = require("../models/User");
const Opportunity = require("../models/Opportunity");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, age, dateOfBirth, image } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, age, dateOfBirth, image },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user profile", error: error.message });
  }
};

exports.getAppliedOpportunities = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const appliedOpportunities = await Opportunity.find({
      id: { $in: user.appliedOpportunities },
    });

    res.json(appliedOpportunities);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching applied opportunities",
      error: error.message,
    });
  }
};
