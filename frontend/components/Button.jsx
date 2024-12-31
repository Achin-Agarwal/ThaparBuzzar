import React from "react";
import "../styles/Button.css";

const Button = ({ label,bgColor,color, fontSize,onClick, isActive = false, isIcon = false,borderRadius,padding,border }) => {
  return (
    <button
      className={`custom-button ${isActive ? "active" : ""} ${
        isIcon ? "icon-button" : ""
      }`}
      onClick={onClick}
      style={{ backgroundColor: bgColor, color: color,borderRadius:borderRadius,padding:padding,fontSize:fontSize,border:border }}
    >
      {label}
    </button>
  );
};

export default Button;
