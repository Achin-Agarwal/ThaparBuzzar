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
import SplitText from "../temporary/SplitText";

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

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };
  const images = [
    `${url}/public/images/products/Screenshot 2024-06-28 001118.png-1735716034567.png`,
    `${url}/public/images/products/Screenshot 2024-06-28 001118.png-1735716034567.png`,
    `${url}/public/images/products/Screenshot 2024-06-28 001118.png-1735716034567.png`,
    `${url}/public/images/products/Screenshot 2024-06-28 001118.png-1735716034567.png`,
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
  const handleSale = (sale) => {
    console.log(sale);
    navigate(`/sale/${sale}`);
  };

  return (
    <div className="home-container">
      <div className="home-slider">
        <ImageSlider images={images} />
      </div>
      <section className="bestsellers-section">
        <h1 className="section-title">
          <SplitText
            text="Explore Top Categories"
            className="section-title"
            delay={150}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </h1>
        <div className="product-grid">
          {products.map((product) => (
            // <div className="card-wrapper" key={product.category}>
            <div>
              {/* <h4 className="category-header">
                {product.category}
                <span onClick={() => handleCardClick(product.category)}>
                  <FaArrowRight />
                </span>
              </h4> */}
              <Card
                name={product.name}
                image={`${url}/images/products/${product.image?.[0] || img}`}
                price={product.price}
                rating={product.rating}
                description={product.description}
                onClick={() => handleCardClick(product.category)}
              />
            </div>
          ))}
        </div>
      </section>
      <section className="bestsellers-section">
        <h1 className="section-title">
          <SplitText
            text="Explore On Sale"
            className="section-title"
            delay={150}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </h1>
        <div className="product-grid">
          {products.map((product) => (
            // <div className="card-wrapper" key={product.category}>
            <div>
              {/* <h4 className="category-header">
                {product.category}
                <span onClick={() => handleCardClick(product.category)}>
                  <FaArrowRight />
                </span>
              </h4> */}
              <Card
                name={product.name}
                image={`${url}/images/products/${product.image?.[0] || img}`}
                price={product.price}
                rating={product.rating}
                description={product.description}
                onClick={() => handleSale(product.category)}
              />
            </div>
          ))}
        </div>
      </section>
      <Scroll />
    </div>
  );
};

export default Home;
