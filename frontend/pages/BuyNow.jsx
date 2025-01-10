import React, { useState } from "react";
import "../styles/BuyNow.css";
import { useLocation, useNavigate } from "react-router-dom";
import Price from "../components/Price";
import Address from "../components/Address";
import COD from "../components/COD";
import Button from "../components/Button";

const BuyNow = () => {
  const [activeTab, setActiveTab] = useState("productDetails");
  const navigate = useNavigate();
  const location = useLocation();
  const price = location.state.price;

  const handleEdit = () => {
    navigate("/buyer");
  };

  return (
    <div className="buyNowContainer">
      <div className="priceSection">
        <Price price={price} />
      </div>
      <div className="detailsSection">
        <div className="tabs">
          <button
            onClick={() => setActiveTab("productDetails")}
            className={`tabButton ${
              activeTab === "productDetails" ? "activeTab" : ""
            }`}
          >
            Address
          </button>
          <div className="arrow">→</div>
          <button
            className={`tabButton ${
              activeTab === "overview" ? "activeTab" : ""
            }`}
          >
            Payment
          </button>
        </div>

        <div className="tabContent">
          {activeTab === "productDetails" && <Address />}
          {activeTab === "overview" && <COD />}
        </div>
        <div className="addressButtons">
          {activeTab === "productDetails" && (
            <>
              <Button bgColor="blue" fontSize="18px" onClick={handleEdit}>
                Edit
              </Button>
              <Button
                bgColor="black"
                fontSize="18px"
                onClick={() => setActiveTab("overview")}
              >
                Next
              </Button>
            </>
          )}
          {activeTab === "overview" && (
            <Button
              bgColor="black"
              fontSize="18px"
              onClick={() => navigate("/cod")}
              margin={"10px 0 0 0"}
            >
              Confirm Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
