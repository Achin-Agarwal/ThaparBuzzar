import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../components/Image";
import { useGoogleLogin } from "@react-oauth/google";
import url from "../url";
import image from "../src/assets/image.png";
import { jwtDecode } from "jwt-decode";

const LoginSwitcher = () => {
  const [activeTab, setActiveTab] = useState("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const images = [
    "../src/assets/1.jpg",
    "../src/assets/2.jpg",
    "../src/assets/3.jpg",
    "../src/assets/4.jpg",
    "../src/assets/5.jpg",
    "../src/assets/6.jpg",
    "../src/assets/7.jpg",
    "../src/assets/8.jpg",
    "../src/assets/9.jpg",
    "../src/assets/10.jpg",
  ];

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(url + "/auth/login", {
        email,
        password,
        role: activeTab,
      });
      console.log(response.data);

      const { token } = response.data;
      const decode=jwtDecode(token)
      console.log(decode)
      localStorage.setItem("authToken", token);
      alert(
        `${
          activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
        } logged in successfully!`
      );
      console.log(email, password, activeTab);
      if (decode.role === "buyer") {
        navigate("/");
      } else if (decode.role === "seller") {
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
    navigate("/verify", { state: { role: activeTab } });
  };

  const forgot = () => {
    navigate("/forgot", { state: { role: activeTab } });
  };

  const responseGoogle = async (authResult) => {
    try {
      const { code } = authResult;
      console.log(code);

      // Send the code to your backend to exchange it for tokens and user info
      const response = await axios.post(
        url + `/auth/google?code=${code}&role=${activeTab}`
      );
      console.log(response.data);
      const { token } = response.data;
      if(response.data.message==="User does not exist"){
        return setError("User does not exist. Please create an account.")
      }
      localStorage.setItem("authToken", token);
      alert(
        `${
          activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
        } logged in successfully!`
      );

      if (activeTab === "buyer") {
        navigate("/");
      } else if (activeTab === "seller") {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      setError("Google login failed. Please try again.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

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
            <Button
              label="Login"
              disabled={loading}
              fontSize="18px"
              padding="12px 22px"
              onClick={handleLogin}
            ></Button>
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
            <button className="google-button" onClick={googleLogin}>
              <img src={image} alt="Google logo" className="google-logo" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
      {/* <div className="login-image">
        <ImageSlider images={images} />
      </div> */}
    </div>
  );
};

export default LoginSwitcher;
