import React from 'react';
import './Card.css';

function convertSpacesToEncoded(str) {
  return str.replace(/ /g, "%20");
}

const Card = ({ name, image, description, price, rating, onClick }) => {
  console.log("Old",image);
  const newImage = convertSpacesToEncoded(image);
  console.log("New",newImage);
  return (
    <div className="product-card" onClick={onClick}>
      <img src={newImage} alt={name} className="product-image" />
      <h3>{name}</h3>
      <p className="description">{description}</p>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>Rating:</strong> {rating}⭐</p>
    </div>
  );
};

export default Card;