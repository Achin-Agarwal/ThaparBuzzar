import React from "react";
import "../styles/Home.css";
import thapar from "../src/assets/thapar.png";

const Home = () => {
  return (
    <div>
      <div>
        <img src={thapar} alt="Thapar Logo" className="thapar" />
      </div>
    </div>
  );
};

export default Home;
