import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Reset.css";
import url from "../url";

const Reset = () => {
  const [otpArray, setOtpArray] = useState(new Array(6).fill("")); // Array for 6 OTP blocks
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const role = location.state?.role;

  // useEffect(() => {
  //   const generateAndSendOtp = async () => {
  //     const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  //     console.log(newOtp);
  //     //   await axios.post("/api/send-otp", { email, otp: newOtp });
  //     setGeneratedOtp(newOtp);
  //   };

  //   generateAndSendOtp();
  // }, [email]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtpArray = [...otpArray];
  
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      newOtpArray[index] = value;
      setOtpArray(newOtpArray);
  
      // Automatically move to the next input field
      if (value !== "" && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  
    // Handle backspace to move to the previous input field
    if (value === "" && e.nativeEvent.inputType === "deleteContentBackward" && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };
  

  const handleVerifyOtp = async(e) => {
    e.preventDefault();
    const enteredOtp = otpArray.join("");
    const response=await axios.put(url + "/resetpassword/verifyotp", { email, otp: enteredOtp,role });
    setMessage(response.data.message);
    if (enteredOtp === generatedOtp) {
      navigate("/newpassword",{state: { email,role }});
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
