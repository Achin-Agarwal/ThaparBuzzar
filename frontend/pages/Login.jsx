import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const LoginSwitcher = () => {
  const [activeTab, setActiveTab] = useState("buyer"); // 'buyer' or 'seller'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      //   const response = await axios.post('http://localhost:5000/api/login', {
      //     email,
      //     password,
      //     role: activeTab,
      //   });

      //   const { token } = response.data;
      //   localStorage.setItem('authToken', token);
      //   alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} logged in successfully!`);
      console.log(email, password, activeTab);
      if(activeTab === "buyer"){
        navigate("/");
      }
      else if(activeTab === "seller"){
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const addUser = () => {
    navigate("/create", { state: { role: activeTab } });
  };

  const forgot = () => {
    navigate("/forgot", { state: { role: activeTab } });
  };

  return (
    <div className="login-c">
      {/* Options */}
      <div className="login-container">
        <h1>Login</h1>
        <div className="login-options">
          <button
            className={`login-option ${activeTab === "buyer" ? "active" : ""}`}
            onClick={() => setActiveTab("buyer")}
          >
            Buyer
          </button>
          <button
            className={`login-option ${activeTab === "seller" ? "active" : ""}`}
            onClick={() => setActiveTab("seller")}
          >
            Seller
          </button>
        </div>

        {/* Login Form */}
        <div className="login-form">
          {/* <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Login</h2> */}
          {error && <p className="error">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button onClick={handleLogin} disabled={loading} className="but">
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <div className="dont-have-account">
            <h4>
              Don’t have an account?
              <span onClick={addUser}>Create an account</span>
            </h4>
            <div className="forgot">
              <h4 onClick={forgot}>Forgot your password?</h4>
            </div>
            <h3>OR</h3>
            <Button label="Continue with Google"></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSwitcher;
