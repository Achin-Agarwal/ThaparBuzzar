import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import url from "../url";
import Card from "../temporary/Card";
import img from "../src/assets/clg logo.png";

const Category = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(url + "/home/products");
        const products = response.data;
        setProducts(
          products.filter((product) => product.category === category)
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, [category]);

  return (
    <div>
      <h1>Category: {category}</h1>
      <div className="bestsellers">
        {products.map((product) => (
          <Card
            key={product._id}
            name={product.name}
            image={img}
            // description={product.description}
            price={product.price}
            rating={product.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default Category;
