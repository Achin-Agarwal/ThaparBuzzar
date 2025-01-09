import React, { useEffect, useState } from "react";
import "../styles/Heading.css";
import clglogo from "../src/assets/clg logo.png";
import buzzarlogo from "../src/assets/buzzar logo.png";
import sign from "../src/assets/sign.jpg";
import search from "../src/assets/search.png";
import cart from "../src/assets/cart.png";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import url from "../url";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Heading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const excludedPaths = ["/dashboard"];

  const handleCardClick = (category) => {
    console.log(category);
    navigate(`/category/${category}`);
  };

  const handleCart = () => {
    console.log("Cart clicked");
    navigate("/cart");
  };

  const handleLogin = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decode = jwtDecode(token);
      console.log(decode);
      if (decode.role === "seller") {
        navigate("/dashboard");
      } else if(decode.role === "buyer"){
        navigate("/buyer");
      }
    }
    else {
      navigate("/login");
    }
  };

  return (
    <div>
      <div className="head">
        <div>
          <img src={clglogo} alt="College Logo" className="image1" />
        </div>
        <div>
          <img src={buzzarlogo} alt="Buzzar Logo" className="image2" />
        </div>
        <div className="heads">
          <div>
            <img
              style={{ cursor: "pointer" }}
              src={sign}
              alt="Sign In"
              className="image3"
              onClick={handleLogin}
            />
          </div>
          <div>
            <img
              src={search}
              alt="Search"
              className="image3"
              style={{ cursor: "pointer" }}
            />
          </div>
          <div>
            <img
              src={cart}
              alt="Shopping Cart"
              className="image3"
              onClick={() => handleCart()}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
      {!excludedPaths.includes(location.pathname) && (
        <div className="nav">
          <p onClick={() => navigate("/")}>All</p>
          <p onClick={() => handleCardClick("Beauty")}>Beauty</p>
          <p onClick={() => handleCardClick("Electronics")}>Electronics</p>
          <p onClick={() => handleCardClick("Fashion")}>Fashion</p>
          <p onClick={() => handleCardClick("Collectibles and art")}>
            Collectibles and Art
          </p>
          <p onClick={() => handleCardClick("Services")}>Services</p>
        </div>
      )}

      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default Heading;
