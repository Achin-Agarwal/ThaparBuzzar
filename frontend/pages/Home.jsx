import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import axios from "axios";
import Card from "../temporary/Card";
import url from "../url";
import img from "../src/assets/clg logo.png";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../components/Image";
import Scroll from "../components/Scroll";
import SplitText from "../temporary/SplitText";

const Home = () => {
  const [topCategoryProducts, setTopCategoryProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const navigate = useNavigate();

  const images = [
    `${url}/public/images/products/Screenshot 2024-06-28 001118.png-1735716034567.png`,
    `${url}/public/images/products/Screenshot 2024-06-28 001118.png-1735716034567.png`,
  ];

  useEffect(() => {
    const fetchTopCategoryProducts = async () => {
      try {
        const response = await axios.get(`${url}/home/bestsellers`);
        const products = response.data;
        console.log(products)

        const res=await axios.get(`${url}/admin/getanouncements`);
        console.log(res.data)

        const maxPriceProducts = products.reduce((acc, product) => {
          if (
            !acc[product.category] ||
            acc[product.category].price < product.price
          ) {
            acc[product.category] = product;
          }
          return acc;
        }, {});

        setTopCategoryProducts(Object.values(maxPriceProducts));
      } catch (error) {
        console.error("Error fetching top category products:", error);
      }
    };

    const fetchDiscountedProducts = async () => {
      try {
        const response = await axios.get(`${url}/home/discountedproducts`);
        console.log(response.data)
        setDiscountedProducts(response.data);
      } catch (error) {
        console.error("Error fetching discounted products:", error);
      }
    };

    fetchTopCategoryProducts();
    fetchDiscountedProducts();
  }, []);

  const handleCardClick = (category) => {
    navigate(`/category/${category}`);
  };

  const handleSale = (sale) => {
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
          />
        </h1>
        <div className="product-grid">
          {topCategoryProducts.map((product) => (
            <div key={product.category}>
              <Card
                name={product.name}
                image={`${url}/images/products/${product.image?.[0] || img}`}
                price={product.price}
                rating={product.rating}
                description={product.description}
                onClick={() => handleCardClick(product.category)}
                discountedPrice={product.discountedPrice}
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
          />
        </h1>
        <div className="product-grid">
          {discountedProducts.map((product) => (
            <div key={product.id}>
              <Card
                name={product.name}
                image={`${url}/images/products/${product.image?.[0] || img}`}
                price={product.price}
                rating={product.rating}
                description={product.description}
                onClick={() => handleSale(product.category)}
                discountedPrice={product.discountedPrice}
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
