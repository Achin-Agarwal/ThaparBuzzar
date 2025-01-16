import React from "react";
import img from "../src/assets/thapar.png";
import "../styles/Footer.css";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="footer">
      <img src={img} alt="Sample" className="image" />
      <div className="text-overlay">
        <div className="columns">
          <div className="column" onClick={()=>{
            navigate("/about")
          }} style={{cursor:"pointer"}}>
            <div className="header">
              <p>ABOUT US</p>
            </div>
            <div className="contents">
              <p>
                Welcome to Thapar Buzzar, the official marketplace for Thapar
                University’s entrepreneurial ventures. We are a vibrant platform
                that connects innovative student businesses with a supportive
                community, offering unique, locally crafted products. Our
                mission is to empower young entrepreneurs, celebrate creativity,
                and foster a thriving ecosystem of innovation right on campus.
              </p>
              <p>Powered by: THE GLITCH</p>
            </div>
          </div>
          <div className="column">
            <div className="header">
              <p>RESOURCES</p>
            </div>
            <div className="contents">
              <p>Home page</p>
              <p>Shop</p>
              <p>Why Thapar Buzzar</p>
              <p
                onClick={() => navigate("/privacy")}
                style={{ cursor: "pointer" }}
              >
                Privacy policy
              </p>
            </div>
          </div>
          <div className="column">
            <div className="header">
              <p>SUPPORTED BY</p>
            </div>
            <div className="contents">
              <p>LMTSM</p>
              <p>Thapar Institute of Engineering and Technology</p>
            </div>
          </div>
          <div className="column">
            <div className="header">
              <p>SOCIALS</p>
            </div>
            <div
              className="contents"
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <FaInstagram size="1.7rem" color="white" />
                <p>Instagram</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <CiLinkedin size="2rem" color="white" />
                <p>LinkedIn</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-text">
          <p>
            LM Thapar School of Management and Thapar Institute of Engineering
            and Technology are not for profit educational institution. Both
            these institutions are not involved in selling of products offered
            on this platform buzzar.thapar.edu. This platform is for students
            experiential learning, with all transactions solely between buyers
            and sellers. Institute is not a party in these transactions and
            cannot be held accountable for any transaction happening on this
            platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
