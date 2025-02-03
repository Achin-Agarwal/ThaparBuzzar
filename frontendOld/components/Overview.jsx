import React, { useEffect, useState } from "react";
import productData from "../productData";
import "../styles/Overview.css";
import { Line } from "react-chartjs-2";
import axios from "axios";
import url from "../url";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Overview = () => {
  const [timeFrame, setTimeFrame] = useState("day");
  // const [productData, setProductData] = useState([]);

  useEffect(() => async () => {
    console.log("useEffect");
    try {
      const response = await axios.get(url + "/home/products");
      console.log(response.data);
      // setProductData(response.data);
    } catch (error) {
      console.error(error);
    }
  });

  const revenue = productData.reduce(
    (acc, product) => acc + product.price * product.quantitySold,
    0
  );
  const unitSold = productData.reduce(
    (acc, product) => acc + product.quantitySold,
    0
  );
  const averageOrderValue = Math.floor(revenue / unitSold);

  const lowStockItems = productData.filter(
    (product) => product.quantityLeft < 5
  );

  // Sort top products by quantitySold in descending order
  const topProducts = [...productData].sort(
    (a, b) => b.quantitySold - a.quantitySold
  );

  // Sort recent sales by timeSold in descending order
  const recentSales = [...productData].sort(
    (a, b) => new Date(b.timeSold) - new Date(a.timeSold)
  );

  const groupedData = productData.reduce((acc, product) => {
    const date = new Date(product.timeSold);
    let key = "";
    if (timeFrame === "day") key = date.toISOString().split("T")[0];
    if (timeFrame === "month")
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (timeFrame === "year") key = `${date.getFullYear()}`;

    if (!acc[key]) acc[key] = 0;
    acc[key] += product.price * product.quantitySold;
    return acc;
  }, {});

  const labels = Object.keys(groupedData).sort();
  const dataPoints = labels.map((label) => groupedData[label]);
  const graphData = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: dataPoints,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1),
        },
      },
      y: {
        title: {
          display: true,
          text: "Revenue",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="overview">
      <div className="first-row">
        <div className="revenue">
          <div>Revenue</div>
          <div className="highlight">{revenue}</div>
        </div>
        <div className="revenue">
          <div>Unit Sold</div>
          <div className="highlight">{unitSold}</div>
        </div>
        <div className="revenue">
          <div>Average Order Value</div>
          <div className="highlight">{averageOrderValue}</div>
        </div>
      </div>
      <div className="line-graph">
        <div className="time-frame-buttons">
          <button
            className={timeFrame === "day" ? "active" : ""}
            onClick={() => setTimeFrame("day")}
          >
            Day
          </button>
          <button
            className={timeFrame === "month" ? "active" : ""}
            onClick={() => setTimeFrame("month")}
          >
            Month
          </button>
          <button
            className={timeFrame === "year" ? "active" : ""}
            onClick={() => setTimeFrame("year")}
          >
            Year
          </button>
        </div>
        <Line data={graphData} options={graphOptions} />
      </div>
      <div className="low-stock">
        <div className="low-stock-title">Low Stock</div>
        <div className="low-stock-header">
          <span className="product-column">Product Name</span>
          <div className="vertical-line"></div>
          <span className="quantity-column">Quantity Left</span>
        </div>
        <div className="low-stock-list">
          {lowStockItems.length > 0 ? (
            lowStockItems.map((product) => (
              <div className="low-stock-item" key={product._id}>
                <span className="product-column">{product.name}</span>
                <div className="vertical-line"></div>
                <span className="quantity-column">{product.quantityLeft}</span>
              </div>
            ))
          ) : (
            <div>No low stock items</div>
          )}
        </div>
      </div>
      <div className="top-products">
        <div className="top-products-title">Top Products</div>
        <div className="top-products-header">
          <span className="product-column">Product Name</span>
          <div className="vertical-line"></div>
          <span className="quantity-column">Revenue</span>
          <div className="vertical-line"></div>
          <span className="quantity-column">Quantity Sold</span>
        </div>
        <div className="top-products-list">
          {topProducts.map((product) => (
            <div className="top-products-item" key={product._id}>
              <span className="product-column">{product.name}</span>
              <div className="vertical-line"></div>
              <span className="quantity-column">
                {product.price * product.quantitySold}
              </span>
              <div className="vertical-line"></div>
              <span className="quantity-column">{product.quantitySold}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="recent-sales">
        <div className="recent-sales-title">Recent Sales</div>
        <div className="recent-sales-header">
          <span className="product-column">Product Name</span>
          <div className="vertical-line"></div>
          <span className="time-column">Time Sold</span>
        </div>
        <div className="recent-sales-list">
          {recentSales.map((product) => (
            <div className="recent-sales-item" key={product._id}>
              <span className="product-column">{product.name}</span>
              <div className="vertical-line"></div>
              <span className="time-column">
                {new Date(product.timeSold).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
