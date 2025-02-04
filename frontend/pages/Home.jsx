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
import Footer from "../components/Footer";
import "../styles/LoadingSpinner.css";

const Home = () => {
  const [topCategoryProducts, setTopCategoryProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchTopCategoryProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/home/bestsellers`);
        const products = response.data;
        console.log(products);

        const res = await axios.get(`${url}/admin/getanouncements`);
        console.log(res.data.productImages);
        setImages(res.data.productImages);

        const maxPriceProducts = products.reduce((acc, product) => {
          acc[product.category] = product;
          return acc;
        }, {});

        setTopCategoryProducts(Object.values(maxPriceProducts));
      } catch (error) {
        console.error("Error fetching top category products:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDiscountedProducts = async () => {
      try {
        const response = await axios.get(`${url}/home/discountedproducts`);
        console.log(response.data);
        setDiscountedProducts(response.data);
      } catch (error) {
        console.error("Error fetching discounted products:", error);
      }
    };

    fetchTopCategoryProducts();
    fetchDiscountedProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  const handleCardClick = (category) => {
    navigate(`/category/${category}`);
  };

  const handleSale = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="home-container">
      <div className="home-slider">
        <ImageSlider images={images} />
      </div>
      <section className="bestsellers-section">
        <h1 className="section-title">
          <SplitText
            text="CATEGORY"
            className="section-title"
            delay={150}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
          />
        </h1>
        <div className="product-grid">
          {/* {topCategoryProducts.map((product) => (
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
          ))} */}
          {topCategoryProducts.map((category) => (
            <div key={category.category} className="category-box" onClick={() => handleCardClick(category.category)}>
              <h2 className="category-title">{category.category}</h2>
              <div className="category-products">
                {/* {category.products.slice(0, 4).map((product) => ( */}
                {topCategoryProducts.map((category) => (
                  <div key={category._id} className="product-item">
                    <img
                      src={`${url}/images/products/${
                        category.image?.[0] || img
                      }`}
                      alt={category.name}
                    />
                    <p>{category.name}</p>
                  </div>
              ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bestsellers-section">
        <h1 className="section-title">
          <SplitText
            text="ON SALE"
            className="section-title"
            delay={150}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
          />
        </h1>
        <div className="product-grid">
          {discountedProducts.map((product) => (
            <div key={product._id}>
              <Card
                name={product.name}
                image={`${url}/images/products/${product.image?.[0] || img}`}
                price={product.price}
                rating={product.rating}
                description={product.description}
                onClick={() => handleSale(product._id)}
                discountedPrice={product.discountedPrice}
              />
            </div>
          ))}
        </div>
      </section>
      {/* <Scroll /> */}
      <Footer />
    </div>
  );
};

export default Home;
