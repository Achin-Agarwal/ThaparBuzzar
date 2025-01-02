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

const Heading = () => {
  const { loginWithRedirect, isAuthenticated, logout, user, getIdTokenClaims } =
    useAuth0();
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

  // useEffect(() => {
  //   const sendData = async () => {
  //     if (isAuthenticated && user) {
  //       setIsLoading(true);
  //       try {
  //         const token = await getIdTokenClaims();
  //         if (!token || !token.__raw) {
  //           console.error("Token is missing!");
  //           return;
  //         }
  //         const response = await axios.post(
  //           "http://localhost:3001/api/user",
  //           { user },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token.__raw}`,
  //             },
  //           }
  //         );
  //         console.log("Response:", response.data);
  //       } catch (error) {
  //         console.error("Error sending data:", error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   sendData();
  // }, [isAuthenticated, user, getIdTokenClaims]);

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
          {isAuthenticated ? (
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logout
            </button>
          ) : (
            <div>
              <img
                style={{ cursor: "pointer" }}
                src={sign}
                alt="Sign In"
                className="image3"
                onClick={() => {
                  navigate("/login");
                }}
              />
            </div>
          )}
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
