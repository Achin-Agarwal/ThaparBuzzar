import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../CartContext";
import "../styles/Cart.css";
import axios from "axios";
import Price from "../components/Price";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext);

  const [updatedCart, setUpdatedCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        console.log(cart);
        // Fetch the cart data from the backend if needed
        // const response = await axios.get("http://your-backend-url/cart");
        // setCart(response.data.cart); // Assuming backend returns { cart: [] }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
      const updatedItem = cart.find((item) => item.id === id);
      const newUpdatedCart = [
        ...updatedCart.filter((item) => item.id !== id),
        { ...updatedItem, quantity: newQuantity },
      ];
      setUpdatedCart(newUpdatedCart);
    }
  };

  const handleUpdateCart = async () => {
    if (updatedCart.length === 0) {
      alert("No changes to update.");
      return;
    }
    try {
      const response = await axios.patch("http://your-backend-url/cart", {
        items: updatedCart,
      });
      console.log("Update Cart Response:", response.data);
      alert("Cart updated successfully!");
      setUpdatedCart([]);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleBuyNow = async () => {
    try {
      // const response = await axios.post("http://your-backend-url/checkout", {
      //   items: cart,
      // });
      // console.log("Buy Now Response:", response.data);
      navigate("/buynow", { state: { price: totalPrice,discount:totalDiscount } });
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const calculateDiscountedPrice = (item) => {
    return item.discount
      ? (item.price - item.price * (item.discount / 100)) * item.quantity
      : item.price * item.quantity;
  };

  const totalPrice = cart.reduce(
    (total, item) => total + calculateDiscountedPrice(item),
    0
  );
  const totalDiscount = cart.reduce(
    (total, item) => total + item.discountedPrice * item.quantity,
    0
  );

  return (
    <div>
      <h1>Your Cart</h1>
      <div className="cart-flex">
        <div className="carting">
          {cart.length === 0 ? (
            <p className="empty-cart-message">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart">
                <div className="fix-text">
                  <h2>{item.name}</h2>
                </div>
                <div
                  className="price-section"
                  style={{ alignItems: "start", gap: "10px" }}
                >
                  {item.discountedPrice ? (
                    <>
                      <div style={{ display: "flex", gap: "15px" }}>
                        <span className="original-price">
                          ₹{item.price * item.quantity}
                        </span>
                        <span className="discounted-price">
                          ₹{item.discountedPrice * item.quantity}
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="price">₹{item.price * item.quantity}</span>
                  )}
                </div>

                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    style={{ fontSize: "18px" }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: "18px" }}>{item.quantity}</span>
                  <button
                    onClick={() => {
                      if (item.quantity < item.available) {
                        handleQuantityChange(item.id, item.quantity + 1);
                      }
                    }}
                    disabled={item.quantity >= item.available}
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
        <div>{cart.length > 0 && <Price price={totalPrice.toFixed(2)} discount={totalDiscount.toFixed(2)}/>}</div>
      </div>
      <div className="cart-actions">
        <button onClick={handleUpdateCart} className="update-button">
          Update Cart
        </button>
        <button onClick={handleBuyNow} className="buy-now-button">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Cart;
