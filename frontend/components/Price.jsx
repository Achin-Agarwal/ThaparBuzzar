import React from "react";
import "../styles/Price.css";

const Price = ({ price, discount = 0, delivery = 0 }) => {
  console.log(price, discount, delivery);
  return (
    <div className="prices">
      <p>Price Details :</p>
      <div className="pdd">
        <p>Price : ₹{price}</p>
        <p>Discount : ₹{discount}</p>
        <p>Delivery Charges : ₹{delivery.toFixed(2)}</p>
      </div>
      <div className="total">
        <span>Total : ₹{(price - discount + delivery).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Price;