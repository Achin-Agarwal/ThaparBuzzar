import React, { useState } from "react";
import "../styles/Forgot.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import url from "../url";

const Forgot = () => {
  const location = useLocation();
  const role = location.state?.role || "User"; // Fallback to 'User' if role is undefined
  console.log(role);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      console.log(email, role);
      const response = await axios.post(url + "/resetpassword", {
        email,
        role,
      });
      console.log(response.data);
      if (response.data.message === "OTP sent successfully") {
        setMessage(response.data.message);
        setError(""); // Clear any previous errors
        alert(response.data.message);
        navigate("/reset", { state: { email, role } });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
      alert(
        err.response?.data?.message ||
          "Failed to send password reset link. Please try again."
      );
      setMessage(""); // Clear any previous success messages
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <h1 className="forgot-title">Forgot Password</h1>
      <p className="forgot-description">
        Enter your email to reset your password
      </p>
      <form className="forgot-form" onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="forgot-input"
          required
        />
        <button type="submit" className="forgot-button" disabled={loading}>
          Reset Password
        </button>
      </form>
      {message && <p className="forgot-success">{message}</p>}
      {error && <p className="forgot-error">{error}</p>}
    </div>
  );
};

export default Forgot;
