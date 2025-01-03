import React, { useState } from "react";
import "../styles/NewPassword.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const role = location.state?.role;

  // Password validation function
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSavePassword = async () => {
    setError("");
    setSuccess("");

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // await axios.post("/api/save-password", { password,email,role });
      setSuccess("Password updated successfully!");
      setTimeout(() => navigate("/login"), 2000); // Navigate after 2 seconds
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="newpassword-container">
      <h2 className="forgot-title">Create New Password</h2>
      <div className="forgot-form">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="forgot-input"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="forgot-input"
        />
        {error && <p className="forgot-error">{error}</p>}
        {success && <p className="forgot-success">{success}</p>}
        <button onClick={handleSavePassword} className="forgot-button">
          Save Password
        </button>
      </div>
    </div>
  );
};

export default NewPassword;
