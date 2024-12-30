import React from "react";
import "../styles/Home.css";
import thapar from "../src/assets/thapar.png";

const Home = () => {
  return (
    <div>
      <div className="nav">
        <p>All</p>
        <p>Beauty</p>
        <p>Electronics</p>
        <p>Fashion</p>
        <p>Collectibles and Art</p>
        <p>Services</p>
      </div>
      <div>
        <img src={thapar} alt="Thapar Logo" className="thapar" />
      </div>
    </div>
  );
};

export default Home;
