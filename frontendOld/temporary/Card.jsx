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

const Card = ({
  name,
  image,
  description,
  price,
  rating,
  onClick,
  discountedPrice,
}) => {
  const newImage = convertSpacesToEncoded(image);
  const discountPercentage = discountedPrice
    ? Math.round(((price - discountedPrice) / price) * 100)
    : null;

  return (
    <div className="product-card-outer" onClick={onClick}>
      <div className="product-card-inner">
        <div className="product-image">
          <img src={newImage} alt={name} />
        </div>
        <div className="namePrice">
          <h3>{name}</h3>
          <div className="price-section">
            {discountedPrice ? (
              <>
                <div style={{ display: "flex",gap:"15px" }}>
                  <span className="original-price">₹{price}</span>
                  <span className="discounted-price">₹{discountedPrice}</span>
                </div>
                <span className="discount-percentage">
                  ({discountPercentage}% OFF)
                </span>
              </>
            ) : (
              <span className="price">₹{price}</span>
            )}
          </div>
        </div>
        <p className="description">{description}</p>
        {/* <div className="stars">{renderStars(rating || 0)}</div> */}
        {/* <div className="buy-button">
          <button>Buy Now</button>
        </div> */}
      </div>
    </div>
  );
};

export default Card;
