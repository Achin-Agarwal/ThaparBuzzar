import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../CartContext";
import "../styles/Cart.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import url from "../url";

const Cart = () => {
  const { cart, setCart, removeFromCart } = useContext(CartContext);
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Please login to view your wishlist");
          navigate("/login");
          return;
        }

        // Fetch user's cart
        const cartResponse = await axios.get(`${url}/buyer/usercart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(cartResponse.data.cart);
        console.log("Cart:", cartResponse.data.cart);
        // Fetch all products
        const productsResponse = await axios.get(`${url}/home/products`);
        const allProducts = productsResponse.data;
        const updatedCart = cartResponse.data.cart.map((item) => {
          const matchingProduct = allProducts.find(
            (product) => product._id === item.product._id
          );

          return {
            ...item,
            product: matchingProduct || item.product,
          };
        });

        setCart(updatedCart);
        console.log("Updated Cart:", updatedCart);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return <p>Your Wishlist is empty.</p>;
  }

  const handleIncreaseQuantity = async (item) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${url}/buyer/addtocart/${item.product._id}/1`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${url}/buyer/deleatecartitem/${item.product._id}/1`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.cart);
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      alert("Failed to decrease quantity. Please try again.");
    }
  };

  const handleRemoveFromCart = async (item) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please login to manage your Wishlist");
        navigate("/login");
        return;
      }
      const response = await axios.post(
        `${url}/buyer/deleatecartitem/${item.product._id}/${item.quantity}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.cart);
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      alert("Failed to remove item from the wishlist. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="wishlist-title">Your Wishlist</h1>
      <div className="cart-containers">
        {cart.map((item) => (
          <div key={item.id} className="cart-items">
            <div className="product-imagess">
              <img
                alt={item.product.name}
                src={`${url}/images/products/${item.product.image?.[0]}`}
              />
            </div>
            <div className="product-detailss">
              <h2>{item.product.name}</h2>
              <div
                className="price-section"
                style={{ alignItems: "start", gap: "10px" }}
              >
                {item.product.discountedPrice ? (
                  <div style={{ display: "flex", gap: "15px" }}>
                    <span className="original-price">
                      ₹{item.product.price * item.quantity}
                    </span>
                    {item.product.numberOfUses < item.quantity ? (
                      <span className="discounted-price">
                        ₹
                        {item.product.discountedPrice *
                          item.product.numberOfUses}
                      </span>
                    ) : (
                      <span className="discounted-price">
                        ₹{item.product.discountedPrice * item.quantity}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="price">
                    ₹{item.product.price * item.quantity}
                  </span>
                )}
              </div>
              <h2>Vendor Details :</h2>
              <p>Business Name: {item.product.seller.businessName}</p>
              <p>
                Phone Number: {item.product.seller.contactDetails.phoneNumber}
              </p>
              <p>Email: {item.product.seller.contactDetails.email}</p>
              {/* <div className="quantity-controlss"> */}
              {/* <button onClick={() => handleDecreaseQuantity(item)}>-</button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleIncreaseQuantity(item)}
                  disabled={item.quantity >= item.product.stock.available}
                >
                  +
                </button>
              </div>

              {/* Remove Button */}
              <button onClick={() => handleRemoveFromCart(item)} className="remove-buttons">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
