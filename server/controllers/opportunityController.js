const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const Opportunity = require("../models/Opportunity");
const mongoose = require("mongoose");

exports.getOpportunities = (req, res) => {
  try {
    const jsonPath = path.join(__dirname, "..", "data", "opportunities.json");
    const jsonData = fs.readFileSync(jsonPath, "utf8");
    const data = JSON.parse(jsonData);

    const opportunities = Object.values(data.internships_meta).map(
      (opportunity) => ({
        id: opportunity.id,
        title: opportunity.title,
        companyName: opportunity.company_name,
        profileName: opportunity.profile_name,
        location: opportunity.location_names.join(", "),
        stipend: opportunity.stipend.salary,
        duration: opportunity.duration,
        startDate: opportunity.start_date,
        applicationType: opportunity.type,
        companyLogo: opportunity.company_logo,
        postedOn: opportunity.posted_on,
        applicationDeadline: opportunity.application_deadline,
      })
    );

    res.json(opportunities);
  } catch (error) {
    console.error("Error in getOpportunities:", error);
    res
      .status(500)
      .json({ message: "Error fetching opportunities", error: error.message });
  }
};

exports.getOpportunity = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const jsonPath = path.join(__dirname, "..", "data", "opportunities.json");
    const jsonData = fs.readFileSync(jsonPath, "utf8");
    const data = JSON.parse(jsonData);

    const opportunity = data.internships_meta[id];

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const formattedOpportunity = {
      id: opportunity.id,
      title: opportunity.title,
      companyName: opportunity.company_name,
      profileName: opportunity.profile_name,
      location: opportunity.location_names.join(", "),
      stipend: opportunity.stipend.salary,
      duration: opportunity.duration,
      startDate: opportunity.start_date,
      applicationType: opportunity.type,
      companyLogo: opportunity.company_logo,
      postedOn: opportunity.posted_on,
      applicationDeadline: opportunity.application_deadline,
    };

    res.json(formattedOpportunity);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching opportunity", error: error.message });
  }
};

exports.applyToOpportunity = async (req, res) => {
  try {
    const opportunityId = req.params.id;
    const userId = req.user.id;

    // Check if the opportunity exists
    const jsonPath = path.join(__dirname, "..", "data", "opportunities.json");
    const jsonData = fs.readFileSync(jsonPath, "utf8");
    const data = JSON.parse(jsonData);
    const opportunity = data.internships_meta[opportunityId];

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if the user has already applied
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has already applied to this opportunity
    if (user.appliedOpportunities.includes(opportunityId)) {
      return res
        .status(400)
        .json({ message: "You have already applied to this opportunity" });
    }

    // Add the opportunity to the user's applied opportunities
    user.appliedOpportunities.push(opportunityId);
    await user.save();

    // If you want to store applications in the Opportunity model as well:
    let opportunityDoc = await Opportunity.findOne({ id: opportunityId });
    if (!opportunityDoc) {
      // Parse stipend to a number
      const stipendMatch = opportunity.stipend.salary.match(/\d+/);
      const stipendValue = stipendMatch ? parseInt(stipendMatch[0], 10) : 0;

      // Parse start date
      let startDate = new Date();
      if (opportunity.start_date !== "Starts Immediately") {
        startDate = new Date(opportunity.start_date);
      }

      opportunityDoc = new Opportunity({
        id: opportunityId,
        profileName: opportunity.profile_name,
        companyName: opportunity.company_name,
        stipend: stipendValue,
        location: opportunity.location_names.join(", "),
        duration: opportunity.duration,
        startDate: startDate,
      });
    }
    opportunityDoc.applicants.push(userId);
    await opportunityDoc.save();

    res
      .status(200)
      .json({ message: "Successfully applied to the opportunity" });
  } catch (error) {
    console.error("Error in applyToOpportunity:", error);
    res
      .status(500)
      .json({ message: "Error applying to opportunity", error: error.message });
  }
};