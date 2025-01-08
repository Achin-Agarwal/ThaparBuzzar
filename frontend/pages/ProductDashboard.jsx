import React, { useEffect, useState } from "react";
import AddProducts from "../components/AddProducts";
import "../styles/ProductDashboard.css";
import Button from "../components/Button";
import Overview from "../components/Overview";
import url from "../url";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("productDetails");
  const navigate = useNavigate();
  useEffect(() => {
    const tokens = localStorage.getItem("authToken");
    console.log(tokens);
    const decoded = jwtDecode(tokens);
    console.log("Decoded Token:", decoded);
    if (decoded.role === "seller") {
      try {
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      navigate("/login");
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "productDetails":
        return <AddProducts />;
      case "overview":
        return <Overview />;
      default:
        return <h2>Select an option</h2>;
    }
  };

  const handleSignOut = () => {
    // Remove the token from local storage
    localStorage.removeItem("authToken");
    // Redirect to the logout URL
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <Button
          onClick={() => setActiveTab("productDetails")}
          label="Product Details"
          fontSize="18px"
        ></Button>
        <Button
          onClick={() => setActiveTab("overview")}
          label="Overview"
          fontSize="18px"
        ></Button>
        <Button
          onClick={handleSignOut}
          label="Sign Out"
          fontSize="18px"
        ></Button>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
