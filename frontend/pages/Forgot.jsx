import React, { useState } from "react";
import "../styles/Forgot.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Forgot = () => {
  const location = useLocation();
  const role = location.state?.role || "User"; // Fallback to 'User' if role is undefined
  console.log(role);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate=useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
    //   const response = await axios.post("https://your-backend-url/api/forgot-password", { email, role });
    //   setMessage(response.data.message);
      setError(""); // Clear any previous errors
      alert("Password reset link sent to your email!");
      navigate("/reset", { state: { email } });

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setMessage(""); // Clear any previous success messages
    }
  };

  return (
    <div className="forgot-container">
      <h1 className="forgot-title">Forgot Password</h1>
      <p className="forgot-description">Enter your email to reset your password</p>
      <form className="forgot-form" onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="forgot-input"
          required
        />
        <button type="submit" className="forgot-button">
          Reset Password
        </button>
      </form>
      {message && <p className="forgot-success">{message}</p>}
      {error && <p className="forgot-error">{error}</p>}
    </div>
  );
};

export default Forgot;
