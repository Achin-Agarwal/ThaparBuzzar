import React, { useState } from "react";
import "../styles/Heading.css";
import clglogo from "../src/assets/images.jpg";
import buzzarlogo from "../src/assets/buzzar logo.png";
import { CgProfile } from "react-icons/cg";
import { IoIosSearch } from "react-icons/io";
import { BsHandbag } from "react-icons/bs";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Autocomplete from "./Autocomplete";
import url from "../url";
import axios from "axios";

const Heading = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const excludedPaths = ["/dashboard"];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleCart = () => {
    console.log("Cart clicked");
    navigate("/cart");
  };
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      console.log("Query is less than 3");
      return [];
    }
    const response = await axios.get(
      url + `/search/autocomplete?query=${query}`,
      {
        data: { role: 5 },
      }
    );
    console.log("This is ", response.data);
    // if (!response.ok) {
    //   throw new Error("Network response was not ok");
    // }
    return response.data;
  };
  const handleSearchSelect = async(selectedItem) => {
    console.log("Selected Item:", selectedItem);
    // Navigate to the product page or display more details
    const response=await axios.get(url+`/search/${selectedItem.id}`)
    navigate(`/product/${selectedItem.id}`); // Adjust route as needed
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu after navigation
  };
  const handleLogin = async () => {
    const token = localStorage.getItem("authToken");
    if (token !== "undefined" && token !== null) {
      console.log(token);
      const decode = jwtDecode(token);
      console.log(decode);
      if (decode.role === "seller") {
        navigate("/dashboard");
      } else if (decode.role === "buyer") {
        navigate("/buyer");
      }
    } else {
      navigate("/login");
    }
    setIsMenuOpen(false);
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
              onClick={handleLogin}
            />
          </div>
          <div className="search-icon">
            <IoIosSearch
              color="white"
              size="40px"
              className="image3"
              onClick={() => setSearchVisible(!searchVisible)} // Toggle visibility
            />
          </div>
          {searchVisible && (
            <div className="search-overlay">
              <div className="search-modal">
                <Autocomplete
                  placeholder="Search for products..."
                  fetchSuggestions={fetchSuggestions}
                  dataKey="name"
                  customLoading={<div>Loading...</div>}
                  onSelect={(res) => handleSearchSelect(res)}
                  customStyles={{
                    width: "100%",
                    padding: "15px",
                  }}
                />
                <button
                  className="close-button"
                  onClick={() => setSearchVisible(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          <div className="cart-icon">
            <BsHandbag
              color="white"
              size="35px"
              className="image3"
              onClick={handleCart}
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
            <p onClick={() => handleCardClick("Food")}>Food</p>
            <p onClick={() => handleCardClick("Fashion")}>Fashion</p>
            <p onClick={() => handleCardClick("Decor")}>Decor</p>
            <p onClick={() => handleCardClick("Health")}>Health</p>
            <p onClick={() => handleCardClick("Services")}>Services</p>
            <p onClick={() => handleCardClick("Others")}>Others</p>
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
          <p onClick={() => handleCardClick("Food")}>Food</p>
          <p onClick={() => handleCardClick("Fashion")}>Fashion</p>
          <p onClick={() => handleCardClick("Decor")}>Decor</p>
          <p onClick={() => handleCardClick("Health")}>Health</p>
          <p onClick={() => handleCardClick("Services")}>Services</p>
          <p onClick={() => handleCardClick("Others")}>Others</p>
        </div>
      )}
    </div>
  );
};

export default Heading;
