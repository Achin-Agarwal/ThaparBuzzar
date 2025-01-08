import React, { useEffect, useState } from "react";
import "../styles/BuyerDashboard.css";
import Button from "../components/Button";
import url from "../url";
import { useLocation, useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import Orders from "../components/Orders";
import { jwtDecode } from "jwt-decode";

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState("productDetails");
  const location=useLocation()
  const navigate = useNavigate();
  const { response }=location.state || {};
  console.log(response.user);

  useEffect(() => {
    const tokens = localStorage.getItem("authToken");
    console.log(tokens);
    const decoded = jwtDecode(tokens);
    console.log("Decoded Token:", decoded.role);
    if (decoded.role === "buyer") {
      try {
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      navigate("/");
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "productDetails":
        return <UserProfile />;
      case "overview":
        return <Orders />;
      default:
        return <h2>Select an option</h2>;
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="buyerdashboard">
      <div className="buyersidebar">
        <Button
          onClick={() => setActiveTab("productDetails")}
          label="My Profile"
          fontSize="18px"
        ></Button>
        <Button
          onClick={() => setActiveTab("overview")}
          label="My Orders"
          fontSize="18px"
        ></Button>
        <Button
          onClick={handleSignOut}
          label="Sign Out"
          fontSize="18px"
        ></Button>
      </div>
      <div className="buyercontent">{renderContent()}</div>
    </div>
  );
};

export default BuyerDashboard;
