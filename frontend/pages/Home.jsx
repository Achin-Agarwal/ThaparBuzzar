import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import thapar from "../src/assets/thapar.png";
import axios from "axios";
import Card from "../temporary/Card";
import url from "../url";

const Home = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(url + "/products");
      console.log(response.data);
      setProducts(response.data);
    };
    fetchProducts();
  }, []);
  return (
    <div>
      <div>
        <img src={thapar} alt="Thapar Logo" className="thapar" />
      </div>
      <div>
        {products.map((product) => (
          <Card
            key={product.id}
            name={product.name}
            image={product.image}
            description={product.description}
            price={product.price}
            rating={product.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
