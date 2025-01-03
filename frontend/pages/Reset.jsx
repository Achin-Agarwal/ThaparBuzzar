import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Reset.css";

const Reset = () => {
  const [otpArray, setOtpArray] = useState(new Array(6).fill("")); // Array for 6 OTP blocks
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    const generateAndSendOtp = async () => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(newOtp);
      //   await axios.post("/api/send-otp", { email, otp: newOtp });
      setGeneratedOtp(newOtp);
    };

    generateAndSendOtp();
  }, [email]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtpArray = [...otpArray];
      newOtpArray[index] = value;
      setOtpArray(newOtpArray);

      // Automatically move to the next input field
      if (value !== "" && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otpArray.join("");
    if (enteredOtp === generatedOtp) {
      navigate("/newpassword");
    } else {
      setError("Incorrect OTP. Please try again.");
    }
  };

  return (
    <div className="forgot-container">
      <h1 className="forgot-title">Verify OTP</h1>
      <form className="forgot-form" onSubmit={handleVerifyOtp}>
        <div className="otp-input-container">
          {otpArray.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e, index)}
              className="otp-input"
            />
          ))}
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="forgot-button">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default Reset;
