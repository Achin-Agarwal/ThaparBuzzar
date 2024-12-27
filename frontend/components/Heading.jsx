import React from "react";
import "../styles/Heading.css";
import clglogo from "../src/assets/clg logo.png";
import buzzarlogo from "../src/assets/buzzar logo.png";
import sign from "../src/assets/sign.jpg";
import search from "../src/assets/search.png";
import cart from "../src/assets/cart.png";
import LoginButton from "./LoginButton";
import { useAuth0 } from "@auth0/auth0-react";

const Heading = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <div className="head">
        <div>
          <img src={clglogo} alt="Image 1" className="image1" />
        </div>
        <div>
          <img src={buzzarlogo} alt="Image 2" className="image2" />
        </div>
        <div className="heads">
          <div>
          <img src={sign} alt="Image 3" className="image3" onClick={()=>loginWithRedirect()}/>
          </div>
          <div>
          <img src={search} alt="Image 4" className="image3" />
          </div>
          <div>
          <img src={cart} alt="Image 5" className="image3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heading;
