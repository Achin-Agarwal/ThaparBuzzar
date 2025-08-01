import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import url from "../url";
import Card from "../temporary/Card";
import img from "../src/assets/clg logo.png";
import "../styles/Category.css";
import SplitText from "../temporary/SplitText";

const Category = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url + "/home/products");
        const products = response.data;
        console.log(products);
        setProducts(
          products.filter((product) => product.category === category)
        );
      } catch (error) {
        console.log(error);
      }
      finally{
        setLoading(false);
      }
    };
    fetchCategory();
  }, [category]);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1 style={{ fontFamily: "TheSeasonsRegular" }}>Category: {category}</h1>
      <div className="bestsellersss">
        {currentProducts.map((product) => (
          <Card
            key={product._id}
            name={product.name}
            image={`${url}/images/products/${product.image?.[0] || img}`}
            description={product.description}
            price={product.price}
            rating={product.rating}
            discountedPrice={product.discountedPrice}
            onClick={() => handleCardClick(product._id)}
          />
        ))}
      </div>
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(products.length / productsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Category;
