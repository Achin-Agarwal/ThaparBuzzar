import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import thapar from "../src/assets/thapar.png";
import axios from "axios";
import Card from "../temporary/Card";
import url from "../url";
import img from "../src/assets/clg logo.png";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../components/Image";
import Scroll from "../components/Scroll";
import { FaArrowRight } from "react-icons/fa";

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  console.log(products);
  // const images = [
  //   "../src/assets/1.jpg",
  //   "../src/assets/2.jpg",
  //   "../src/assets/3.jpg",
  //   "../src/assets/4.jpg",
  //   "../src/assets/5.jpg",
  //   "../src/assets/6.jpg",
  //   "../src/assets/7.jpg",
  //   "../src/assets/8.jpg",
  //   "../src/assets/9.jpg",
  //   "../src/assets/10.jpg",
  // ];
  const images = [
    `${url}/public/images/products/Screenshot 2024-06-28 001118.png-1735716034567.png`,
    `${url}/public/images/products/Screenshot 2024-06-28 001118.png-1735716034567.png`,
    `${url}/public/images/products/Screenshot 2024-06-28 001118.png-1735716034567.png`,
    `${url}/public/images/products/Screenshot 2024-06-28 001118.png-1735716034567.png`
  ];
  console.log(images);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(url + "/home/products");
        const products = response.data;

        // Find the product with the max price in each category
        const maxPriceProducts = products.reduce((acc, product) => {
          if (
            !acc[product.category] ||
            acc[product.category].price < product.price
          ) {
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
  function convertSpacesToEncoded(str) {
    return str.replace(/ /g, "%20");
  }

  const handleCardClick = (category) => {
    console.log(category);
    navigate(`/category/${category}`);
  };

  return (
    <div className="home-container">
      <div className="home-image">
        <ImageSlider images={images} />
      </div>
      <div className="bestsellers-section">
        <h1 className="bestsellers-heading">Bestsellers</h1>
        <div className="bestsellers">
          {products.map((product) => (
            <div className="card-container" key={product.category}>
              <div className="bestseller-card">
                <h4 className="category-heading">
                  {product.category}
                  <span onClick={() => handleCardClick(product.category)}>
                  <FaArrowRight />
                  </span>
                </h4>
                <Card
                  name={product.name}
                  image={`${url}/public/images/products/${product.image[0]}`}
                  price={product.price}
                  rating={product.rating}
                  onClick={() => handleCardClick(product.category)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Scroll />
    </div>
  );
};

export default Home;
