import React, { useContext, useEffect } from "react";
import { CartContext } from "../CartContext";
import "../styles/Cart.css";
import axios from "axios";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        console.log(cart);
        // const response = await axios.get("http://your-backend-url/cart");
        // setCart(response.data.cart); // Assuming backend returns { cart: [] }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = async () => {
    try {
      //   const response = await axios.post("http://your-backend-url/cart", { cart });
      console.log(cart);
      alert("Cart submitted successfully!");
    } catch (error) {
      console.error("Error submitting cart:", error);
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div>
      <h1>Your Cart</h1>
      <div>
        {cart.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart">
              <div className="fix-text">
                <h2>{item.name}</h2>
              </div>
              <p>Price: ${item.price * item.quantity}</p>
              <div className="quantity-controls">
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => {
                    if (item.quantity < item.available) {
                      handleQuantityChange(item.id, item.quantity + 1);
                    }
                  }}
                  disabled={item.quantity >= item.available}
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
      <button onClick={handleCheckout}>Update the cart</button>
    </div>
  );
};

export default Cart;
