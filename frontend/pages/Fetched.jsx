import React, { useEffect, useState } from "react";
import "../styles/Fetched.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import url from "../url";
import Card from "../temporary/Card";

const Fetched = () => {
  const location = useLocation();
  console.log(location);
  const que = location.state.queue;
  console.log(que);
  const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);
    const navigate=useNavigate();

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          url + "/search?query=" + que,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching queue:", error);
      }
    };
    fetchQueue();
  }, []);
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
      {/* <h1 style={{fontFamily:'TheSeasonsRegular'}}>Category:</h1> */}
      <div className="bestsellersss">
        {products.map((product) => (
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

export default Fetched;

