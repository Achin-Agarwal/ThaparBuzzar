import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import thapar from "../src/assets/thapar.png";
import axios from "axios";
import Card from "../temporary/Card";
import url from "../url";
import img from "../src/assets/clg logo.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate=useNavigate();
  console.log(products);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(url + "/home/products");
        const products = response.data;

        // Find the product with the max price in each category
        const maxPriceProducts = products.reduce((acc, product) => {
          if (!acc[product.category] || acc[product.category].price < product.price) {
            acc[product.category] = product;
          }
          return acc;
        }, {});

        // Convert the object back to an array
        const filteredProducts = Object.values(maxPriceProducts);
        setProducts(filteredProducts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handleCardClick = (category) => {
    console.log(category);
    navigate(`/category/${category}`);
  };
  
  return (
    <div>
      <div>
        <img src={thapar} alt="Thapar Logo" className="thapar" />
      </div>
      <h1>Bestsellers</h1>
      <div className="bestsellers">
        {products.map((product) => (
          <Card
            key={product._id}
            name={product.name}
            image={img}
            // description={product.description}
            price={product.price}
            rating={product.rating}
            onClick={() => handleCardClick(product.category)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
