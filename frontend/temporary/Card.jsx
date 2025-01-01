import React from 'react';
import './Card.css';

const Card = ({ name, image, description, price, rating }) => {
  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <h3>{name}</h3>
      <p>{description}</p>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>Rating:</strong> {rating}⭐</p>
    </div>
  );
};

export default Card;
