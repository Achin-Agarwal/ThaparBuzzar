import React, { useEffect, useState } from "react";
import AddProducts from "../components/AddProducts";
import "../styles/ProductDashboard.css";
import Button from "../components/Button";
import Overview from "../components/Overview";
import url from "../url";
import { useNavigate } from "react-router-dom";

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState("productDetails");
  const navigate = useNavigate();
  useEffect(() => {
    const tokens = localStorage.getItem("authToken");
    console.log(tokens);
    if (tokens) {
      try {
        setToken(tokens);
        const decoded = jwtDecode(tokens);
        console.log("Decoded Token:", decoded);
        setDecodedToken(decoded);
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
    navigate("/");
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

export default BuyerDashboard;
