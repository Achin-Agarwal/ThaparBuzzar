import React, { useContext, useEffect } from "react";
import { CartContext } from "../CartContext";
import "../styles/Cart.css";
import axios from "axios";
import Price from "../components/Price";
import { useNavigate } from "react-router-dom";
import url from "../url";

const Cart = () => {
  const { cart, setCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${url}/buyer/usercart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data.cart);
        console.log(cart)
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  const handleUpdateQuantity = (id, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleIncreaseQuantity = async (item) => {
    console.log(item)
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${url}/buyer/addtocart/${item._id}/1`, // Adjusted for incrementing by 1
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update cart based on backend response
      console.log(response.data.cart);
      setCart(response.data.cart);
    } catch (error) {
      console.error("Error increasing quantity:", error);
      alert("Failed to increase quantity. Please try again.");
    }
  };

  const handleDecreaseQuantity = async (item) => {
    if (item.quantity <= 1) {
      alert("Quantity cannot be less than 1.");
      return;
    }
    console.log(item)
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${url}/buyer/deleatecartitem/${item._id}/1`, // Adjusted for decrementing by 1
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update cart based on backend response
      setCart(response.data.cart);
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      alert("Failed to decrease quantity. Please try again.");
    }
  };

  const handleBuyNow = () => {
    const totalPrice = cart.reduce(
      (total, item) =>
        total +
        (item.product.discountedPrice
          ? (item.product.price - item.product.price * (item.product.discountedPrice / 100)) * item.quantity
          : item.product.price * item.quantity),
      0
    );

    const totalDiscount = cart.reduce(
      (total, item) =>
        total +
        (item.product.discountedPrice ? item.product.discountedPrice * item.quantity : 0),
      0
    );

    navigate("/buynow", {
      state: {
        price: totalPrice.toFixed(2),
        discount: totalDiscount.toFixed(2),
      },
    });
  };

  return (
    <div>
      <h1>Your Cart</h1>
      <div className="cart-flex">
        <div className="carting">
          {cart.length === 0 ? (
            <p className="empty-cart-message">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="cart">
                <div className="fix-text">
                  <h2>{item.product.name}</h2>
                </div>
                <div
                  className="price-section"
                  style={{ alignItems: "start", gap: "10px" }}
                >
                  {item.product.discountedPrice ? (
                    <div style={{ display: "flex", gap: "15px" }}>
                      <span className="original-price">
                        ₹{item.product.price * item.quantity}
                      </span>
                      <span className="discounted-price">
                        ₹{item.product.discountedPrice * item.quantity}
                      </span>
                    </div>
                  ) : (
                    <span className="price">₹{item.product.price * item.quantity}</span>
                  )}
                </div>

                <div className="quantity-controls">
                  <button
                    onClick={() => handleDecreaseQuantity(item)}
                    style={{ fontSize: "18px" }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: "18px" }}>{item.quantity}</span>
                  <button
                    onClick={() => handleIncreaseQuantity(item)}
                    disabled={item.quantity >= item.product.stock.available}
                    style={{ fontSize: "18px" }}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <Price
            price={cart
              .reduce(
                (total, item) =>
                  total +
                  (item.product.discountedPrice
                    ? (item.product.price - item.product.price * (item.product.discountedPrice / 100)) *
                      item.quantity
                    : item.product.price * item.quantity),
                0
              )
              .toFixed(2)}
            discount={cart
              .reduce(
                (total, item) =>
                  total +
                  (item.product.discountedPrice
                    ? item.product.discountedPrice * item.quantity
                    : 0),
                0
              )
              .toFixed(2)}
          />
        )}
      </div>
      <div className="cart-actions">
        <button onClick={handleBuyNow} className="buy-now-button">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Cart;
