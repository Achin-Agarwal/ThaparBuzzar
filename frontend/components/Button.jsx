import React from "react";
import "../styles/Button.css";

const Button = ({ label,bgColor,color, fontSize,onClick, isActive = false, isIcon = false,borderRadius,padding,border,disabled,children }) => {
  return (
    <button
      className={`custom-button ${isActive ? "active" : ""} ${
        isIcon ? "icon-button" : ""
      }`}
      onClick={onClick}
      style={{ backgroundColor: bgColor, color: color,borderRadius:borderRadius,padding:padding,fontSize:fontSize,border:border ,disabled:disabled}}
    >
      {label}{children}
    </button>
  );
};

export default Button;
