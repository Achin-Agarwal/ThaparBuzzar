import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import url from "../url";
import Card from "../temporary/Card";
import img from "../src/assets/clg logo.png";
import "../styles/Category.css";
import SplitText from "../temporary/SplitText";

const Sale= () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8); // Number of products per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(url + "/home/products");
        const products = response.data;
        setProducts(
          products.filter((product) => product.category === category)
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, [category]);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  // Get current products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>
      <SplitText
          text={`Category: ${category}`}
          className="section-title"
          delay={150}
          animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
          animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="-50px"
        />
        </h1>
      <div className="bestsellersss">
        {currentProducts.map((product) => (
          <Card
            key={product._id}
            name={product.name}
            image={`${url}/images/products/${product.image?.[0] || img}`}
            description={product.description}
            price={product.price}
            rating={product.rating}
            onClick={() => handleCardClick(product._id)}
          />
        ))}
      </div>
      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sale;
