import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("YOUR_BACKEND_URL/orders");
        setOrders(response.data.orders); // Assuming response.data.orders contains the order data
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders">
      <h1>Your Orders</h1>
      <div className="orders-container">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.orderNumber} className="order-card">
              <img src={order.imageUrl} alt="Order" className="order-image" />
              <div className="order-details">
                <h2>Order #{order.orderNumber}</h2>
                <p>
                  Status:{" "}
                  <span className={order.isDelivered ? "delivered" : "pending"}>
                    {order.isDelivered ? "Delivered" : "Pending"}
                  </span>
                </p>
                <p>Delivery Date: {order.deliveryDate || "TBD"}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
