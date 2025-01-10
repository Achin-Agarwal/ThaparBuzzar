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
  const navigate=useNavigate();

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
      // Track the updated items in updatedCart
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
      alert("Order placed successfully!");
      navigate("/buynow",{state:{price:totalPrice}});
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
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
                <div className="fix-text " >
                  <h2>{item.name}</h2>
                </div>
                <p style={{fontSize: "18px"}}>Price: ${item.price * item.quantity}</p>
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    style={{fontSize: "18px"}}
                  >
                    -
                  </button>
                  <span style={{fontSize: "18px"}}>{item.quantity}</span>
                  <button
                    onClick={() => {
                      if (item.quantity < item.available) {
                        handleQuantityChange(item.id, item.quantity + 1);
                      }
                    }}
                    disabled={item.quantity >= item.available}
                    style={{fontSize: "18px"}}
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
        <div>{cart.length > 0 && <Price price={totalPrice}></Price>}</div>
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
