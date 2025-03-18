import React from "react";
import { useNavigate } from "react-router-dom";
import { applyToOpportunity } from "../services/api";

const OpportunityCard = ({ opportunity }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleApply = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      await applyToOpportunity(opportunity.id);
      alert("Successfully applied to the opportunity!");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error("Application error:", error);
        alert("An error occurred while applying to the opportunity");
      }
    }
  };

  const formatStipend = (stipend) => {
    if (typeof stipend === "string") {
      return stipend.replace(/\s+/g, " ").replace("/month", "");
    }
    return stipend;
  };

  const formatStartDate = (startDate) => {
    if (startDate === "Starts Immediately") {
      return startDate;
    }
    return new Date(startDate).toLocaleDateString();
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e0e0e0",
    color: "#333",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "0.5rem"
  };

  const textStyle = {
    marginBottom: "0.5rem",
    fontSize: "1rem"
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s"
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3"
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{opportunity.profileName}</h3>
      <p style={textStyle}>Company: {opportunity.companyName}</p>
      <p style={textStyle}>Stipend: {formatStipend(opportunity.stipend)}</p>
      <p style={textStyle}>Location: {opportunity.location}</p>
      <p style={textStyle}>Duration: {opportunity.duration}</p>
      <p style={textStyle}>Start Date: {formatStartDate(opportunity.startDate)}</p>
      <div>
        <button
          onClick={handleApply}
          style={buttonStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
        >
          {isLoggedIn ? "Apply" : "Login to Apply"}
        </button>
      </div>
    </div>
  );
};

export default OpportunityCard;
