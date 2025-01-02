import React from 'react';
import './Card.css';

const Card = ({ name, image, description, price, rating, onClick }) => {
  return (
    <div className="product-card" onClick={onClick}>
      <img src={image} alt={name} className="product-image" />
      <h3>{name}</h3>
      <p className="description">{description}</p>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>Rating:</strong> {rating}⭐</p>
    </div>
  );
};

export default Card;