import React, { useState } from "react";
import AddProducts from "../components/AddProducts";
import "../styles/ProductDashboard.css";
import Button from "../components/Button";
import Overview from "../components/Overview";
import url from "../url";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("productDetails");

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
          onClick={() => {
            window.location.href = url+"/logout";	
          }}
          label="Sign Out"
          fontSize="18px"
        ></Button>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
