import React, { useEffect, useState } from "react";
import "../styles/BuyNow.css";
import { useLocation, useNavigate } from "react-router-dom";
import Price from "../components/Price";
import Address from "../components/Address";
import COD from "../components/COD";
import Button from "../components/Button";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import url from "../url";

const BuyNow = () => {
  const [activeTab, setActiveTab] = useState("productDetails");
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state);
  const price = location.state.price;
  const discount= location.state.discount;

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log(token)
        if (!token) {
          navigate("/login");
        } else {
          const decode = jwtDecode(token);
          console.log(decode);
          if (decode.role !== "buyer") {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetch();
  }, []);

  const handleEdit = () => {
    navigate("/buyer");
  };

  return (
    <div className="buyNowContainer">
      <div className="priceSection">
        <Price price={price} discount={discount}/>
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
