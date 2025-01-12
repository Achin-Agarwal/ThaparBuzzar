import React from "react";
import "./Card.css";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

function convertSpacesToEncoded(str) {
  return str.replace(/ /g, "%20");
}
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} color="gold" />);
    } else if (i - rating < 1) {
      stars.push(<FaStarHalfAlt key={i} color="gold" />);
    } else {
      stars.push(<FaRegStar key={i} color="gold" />);
    }
  }
  return stars;
};

const Card = ({ name, image, description, price, rating, onClick }) => {
  const newImage = convertSpacesToEncoded(image);

  return (
    <div className="product-card-outer" onClick={onClick}>
      <div className="product-card-inner">
        <div className="product-image">
          <img src={newImage} alt={name} />
        </div>
        <div className="namePrice">
          <h3>{name}</h3>
          <span>₹{price}</span>
        </div>
        <p className="description">{description}</p>
        <div className="stars">{renderStars(rating || 0)}</div>
        <div className="buy-button">
          <button>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
