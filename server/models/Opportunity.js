const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    profileName: { type: String, required: true },
    companyName: { type: String, required: true },
    stipend: { type: Number, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    startDate: { type: Date, required: true },
    description: { type: String },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

module.exports = Opportunity;
