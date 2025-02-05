import React, { useEffect, useState, useRef } from "react";
import "../styles/Heading.css";
import clglogo from "../src/assets/images.jpg";
import buzzarlogo from "../src/assets/buzzar logo.jpg";
import { CgProfile } from "react-icons/cg";
import { IoIosSearch } from "react-icons/io";
import { BsHandbag } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Autocomplete from "./Autocomplete";
import url from "../url";
import axios from "axios";
import Button from "./Button";

const Heading = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [que, setQue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const excludedPaths = ["/dashboard"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchVisible(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setSearchVisible(false);
      }
    };
    if (searchVisible) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [searchVisible]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleCart = () => {
    console.log("Wistlist clicked");
    navigate("/cart");
  };
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      console.log("Query is less than 3");
      return [];
    }
    setQue(query);
    const response = await axios.get(
      url + `/search/autocomplete?query=${query}`,
      {
        data: { role: 5 },
      }
    );
    console.log("This is ", response.data);
    return response.data;
  };

  const handleSearchSelect = async (selectedItem) => {
    console.log("Selected Item:", selectedItem);
    setSearchVisible(false);
    navigate(`/searched`, { state: { queue: que } });
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
      <div className="head">
        <img
          src={clglogo}
          alt="College Logo"
          className="image1"
          onClick={() => window.open("https://lmtsm.thapar.edu/", "_blank")}
          style={{ cursor: "pointer" }}
        />
        <img
          src={buzzarlogo}
          alt="Buzzar Logo"
          className="image2"
          onClick={() => handleNavigation("/")}
          style={{ cursor: "pointer" }}
        />
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
              onClick={() => setSearchVisible(true)}
            />
          </div>
          {searchVisible && (
            <div className="search-overlay">
              <div className="search-modal" ref={searchRef}>
                <Autocomplete
                  placeholder="Search for products..."
                  fetchSuggestions={fetchSuggestions}
                  dataKey="name"
                  customLoading={<div>Loading...</div>}
                  onSelect={(res) => handleSearchSelect(res)}
                  customStyles={{
                    borderRadius: "8px 0 0 8px",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchSelect(que);
                    }
                  }}
                />
                <Button
                  onClick={() => handleSearchSelect(que)}
                  bgColor="rgba(36, 34, 34, 0.47)"
                  fontSize="1.2rem"
                  borderRadius="0px 8px 8px 0px"
                >
                  Search
                </Button>
              </div>
            </div>
          )}

          <div className="cart-icon">
            <FaRegHeart
              color="white"
              size="35px"
              className="image3"
              onClick={handleCart}
            />
          </div>
          <HiOutlineDotsVertical
            color="white"
            size="35px"
            className="menu-icon image3"
            onClick={toggleMenu}
          />
        </div>
      </div>
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
                <FaRegHeart
                  color="white"
                  size="35px"
                  className="image3"
                  onClick={handleCart}
                />
              <span>Go to Wistlist</span>
            </div>
          </div>
        </div>
      )}
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
