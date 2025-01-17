import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import url from "../url";
import img from "../src/assets/clg logo.png";
import "../styles/Product.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Card from "../temporary/Card";
import { CartContext } from "../CartContext";

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} color="gold" />);
    } else if (i - rating < 1) {
      stars.push(<FaStarHalfAlt key={i} color="gold" />);
    } else {
      stars.push(<FaRegStar key={i} color="gold" />);
    }
  }
  return stars;
};

const Product = ({ productadd }) => {
  const { id } = useParams();
  const [products, setProducts] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url + "/home/products");
        const products = response.data;
        console.log(products);
        const product = products.find((product) => product._id === id);
        setProducts(product);

        if (product) {
          const categoryProducts = products
            .filter((p) => p.category === product.category)
            .filter((p) => p._id !== product._id);
          setAllProducts(categoryProducts);
        }

        console.log(allProducts);
      } catch (error) {
        console.log(error);
      }
      finally{
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? products.image.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === products.image.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleAddToCart = async () => {
    const tokens = localStorage.getItem("authToken");
    if (!tokens) {
      alert("Please login to add to cart");
      navigate("/login");
    }
    alert(`${products.name} added to cart with quantity ${quantity}`);
    // const cartItem = {
    //   productId: products._id,
    //   name: products.name,
    //   price: products.price,
    //   quantity,
    //   // image: products.images[currentImageIndex],
    // };
    const cartItem = {
      id: products._id,
      name: products.name,
      price: products.price,
      quantity: quantity,
      available: products.stock.available,
      discountedPrice: products.discountedPrice,
      image: products.image[currentImageIndex],
    };
    addToCart(cartItem);
    console.log(cartItem);
    localStorage.setItem("cart", JSON.stringify(cartItem));
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${url}/buyer/addtocart/${products._id}/${quantity}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Add to cart response:", response.data);
      console.log("cartItem", cartItem);
      alert("Cart submitted successfully!");
      navigate("/cart", { state: { cartItem } });
    } catch (error) {
      console.error("Error submitting cart:", error);
    }
  };

  const price = products.price || 0;
  const discountedPrice = products.discountedPrice || 0;
  const discountPercentage =
    discountedPrice && price
      ? Math.round(((price - discountedPrice) / price) * 100)
      : 0;

  const handleBuyNow = () => {
    alert(`Proceeding to buy ${products.name} with quantity ${quantity}`);
    if (products.numberOfUses < quantity) {
      console.log("discounted1", discountedPrice);
      navigate("/buynow", {
        state: {
          price: price * quantity,
          discount: discountedPrice * products.numberOfUses,
          quantity:quantity,
          id:products._id,
          text:"false",
        },
      });
    } else {
      console.log("discounted2", products.numberOfUses);
      navigate("/buynow", {
        state: {
          price: price * quantity,
          discount: discountedPrice * quantity,
          quantity:quantity,
          id:products._id,
          text:"false",
        },
      });
    }
  };

  const increaseQuantity = () => {
    if (quantity < products.stock.available) {
      setQuantity((prevQty) => prevQty + 1);
    }
  };
  const decreaseQuantity = () =>
    setQuantity((prevQty) => (prevQty > 1 ? prevQty - 1 : 1));

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="">
      <div className="product-details">
        <div className="product-images">
          {products.image && (
            <>
              <img
                src={`${url}/images/products/${
                  products.image[currentImageIndex] || img
                }`}
                alt={products.name}
                className="product-imagee"
              />
              <button className="image-arrow left" onClick={handlePrevImage}>
                <FaArrowLeft />
              </button>
              <button className="image-arrow right" onClick={handleNextImage}>
                <FaArrowRight />
              </button>
            </>
          )}
        </div>
        <div className="product-info">
          <h1>{products.name}</h1>
          <div>
            {products.stock?.sold > 1 && (
              <p className="sold">{products.stock.sold} items sold</p>
            )}
          </div>
          <div
            className="price-section"
            style={{ alignItems: "start", gap: "10px" }}
          >
            {discountedPrice ? (
              <>
                <div style={{ display: "flex", gap: "15px" }}>
                  <span className="original-price">₹{price}</span>
                  <span className="discounted-price">₹{discountedPrice}</span>
                </div>
                <span className="discount-percentage">
                  ({discountPercentage} % OFF)
                </span>
              </>
            ) : (
              <span className="price">₹{price}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px", margin: "15px 0px" }}>
            {products.stock?.available > 10 && (
              <p className="stock in-stock">In Stock</p>
            )}
            {products.stock?.available > 0 &&
              products.stock?.available <= 10 && (
                <p className="stock few-stock">Few Stock Left</p>
              )}
            {products.stock?.available === 0 && (
              <p className="stock out-of-stock">Out of Stock</p>
            )}
          </div>
          <p className="rating">Rating: {renderStars(products.rating || 0)}</p>
          <div className="quantity-control">
            <button onClick={decreaseQuantity} className="quantity-btn">
              -
            </button>
            <span>{quantity}</span>
            <button onClick={increaseQuantity} className="quantity-btn">
              +
            </button>
          </div>
          <div className="action-buttonss">
            {products.stock?.available > 0 ? (
              <>
                <button className="btn add-to-cart" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button className="btn buy-now" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </>
            ) : (
              <p className="out-of-stock-message">
                This product is currently out of stock.
              </p>
            )}
          </div>
          <p className="description">{products.description}</p>
        </div>
      </div>
      <div>
        <h1 style={{ fontFamily: "TheSeasonsRegular" }}>
          Products you may like <FaArrowRight />
        </h1>
        <div className="parent-container">
          {allProducts.map((product) => (
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
      </div>
    </div>
  );
};

export default Product;
