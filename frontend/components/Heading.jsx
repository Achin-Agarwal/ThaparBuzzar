import React, { useState } from "react";
import "../styles/Heading.css";
import clglogo from "../src/assets/images.jpg";
import buzzarlogo from "../src/assets/buzzar logo.png";
import { CgProfile } from "react-icons/cg";
import { IoIosSearch } from "react-icons/io";
import { BsHandbag } from "react-icons/bs";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

const Heading = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const excludedPaths = ["/dashboard"];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu after navigation
  };

  const handleCardClick = (category) => {
    navigate(`/category/${category}`);
    setIsMenuOpen(false);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="head">
        <img src={clglogo} alt="College Logo" className="image1" />
        <img src={buzzarlogo} alt="Buzzar Logo" className="image2" />
        <div className="heads">
          <div className="profile-icon">
            <CgProfile
              color="white"
              size="40px"
              className="image3"
              onClick={() => handleNavigation("/login")}
            />
          </div>
          <div className="search-icon">
            <IoIosSearch color="white" size="40px" className="image3" />
          </div>
          <div className="cart-icon">
            <BsHandbag
              color="white"
              size="35px"
              className="image3"
              onClick={() => handleNavigation("/cart")}
            />
          </div>
          <HiOutlineDotsVertical
            color="white"
            size="35px"
            className="menu-icon"
            onClick={toggleMenu}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="menu-items">
            <p onClick={() => handleNavigation("/")}>All</p>
            <p onClick={() => handleCardClick("Beauty")}>Beauty</p>
            <p onClick={() => handleCardClick("Electronics")}>Electronics</p>
            <p onClick={() => handleCardClick("Fashion")}>Fashion</p>
            <p onClick={() => handleCardClick("Collectibles and art")}>
              Collectibles and Art
            </p>
            <p onClick={() => handleCardClick("Services")}>Services</p>
            <div
              className="menu-cart"
              onClick={() => handleNavigation("/cart")}
            >
              <BsHandbag color="white" size="35px" />
              <span>Go to cart</span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Nav */}
      {!excludedPaths.includes(location.pathname) && (
        <div className="nav">
          <p onClick={() => handleNavigation("/")}>All</p>
          <p onClick={() => handleCardClick("Beauty")}>Beauty</p>
          <p onClick={() => handleCardClick("Electronics")}>Electronics</p>
          <p onClick={() => handleCardClick("Fashion")}>Fashion</p>
          <p onClick={() => handleCardClick("Collectibles and art")}>
            Collectibles and Art
          </p>
          <p onClick={() => handleCardClick("Services")}>Services</p>
        </div>
      )}
    </div>
  );
};

export default Heading;
