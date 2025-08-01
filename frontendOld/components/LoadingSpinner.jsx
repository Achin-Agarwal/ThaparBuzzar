import React from "react";
import "../styles/LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
