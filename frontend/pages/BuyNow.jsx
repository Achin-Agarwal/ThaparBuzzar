import React, { useEffect, useState } from "react";
import "../styles/BuyNow.css";
import { useLocation, useNavigate } from "react-router-dom";
import Price from "../components/Price";
import Address from "../components/Address";
import COD from "../components/COD";
import Button from "../components/Button";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import url from "../url";

const BuyNow = () => {
  const [activeTab, setActiveTab] = useState("productDetails");
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({
    roomNumber: "",
    floor: "",
    city: "",
    hostel: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state);
  const price = location.state?.price;
  const discount = location.state?.discount;
  const text = location.state?.text;
  const quantity = location.state?.quantity;
  const id = location.state?.id;

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }
        const decoded = jwtDecode(token);
        if (decoded.role !== "buyer") {
          navigate("/login");
          return;
        }
        const response = await axios.get(url + "/buyer/getalldetails", {
          headers: { authorization: `Bearer ${token}` },
        });

        if (response.data?.deals?.address) {
          setAddress(response.data.deals.address);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
      finally{
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleEdit = () => {
    navigate("/buyer");
  };
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  const handleCOD = () => {
    if (
      !address.roomNumber ||
      !address.floor ||
      !address.city ||
      !address.hostel
    ) {
      alert("Please fill in all address details.");
      navigate("/buyer");
      return;
    }
    setActiveTab("overview");
  };

  const Confirm = async () => {
    const token = localStorage.getItem("authToken");
    console.log("id", id, "quantity", quantity, "text", text);
  
    try {
      let response;
      if (text === "false") {
        response = await axios.post(
          `${url}/buyer/addtocart`,
          {
            id: id,
            quantity: quantity,
            text: text,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (text === "true") {
        response = await axios.post(
          `${url}/buyer/addtocart`,
          {
            id: id,
            quantity: quantity,
            text: text,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      console.log("Add to cart response:", response.data);
      alert("Product purchased successfully!");
      navigate("/cart");
    } catch (error) {
      console.error("Error purchasing product:", error);
    }
  };
  

  return (
    <div className="buyNowContainer">
      <div className="priceSection">
        <Price price={price} discount={discount} />
      </div>
      <div className="detailsSection">
        <div className="tabs">
          <button
            onClick={() => setActiveTab("productDetails")}
            className={`tabButton ${
              activeTab === "productDetails" ? "activeTab" : ""
            }`}
          >
            Address
          </button>
          <div className="arrow">→</div>
          <button
            className={`tabButton ${
              activeTab === "overview" ? "activeTab" : ""
            }`}
          >
            Payment
          </button>
        </div>

        <div className="tabContent">
          {activeTab === "productDetails" && (
            <Address address={address} onEdit={handleEdit} />
          )}
          {activeTab === "overview" && <COD />}
        </div>
        <div className="addressButtons">
          {activeTab === "productDetails" && (
            <>
              <Button bgColor="blue" fontSize="18px" onClick={handleEdit}>
                Edit
              </Button>
              <Button bgColor="black" fontSize="18px" onClick={handleCOD}>
                Next
              </Button>
            </>
          )}
          {activeTab === "overview" && (
            <Button
              bgColor="black"
              fontSize="18px"
              onClick={Confirm}
              margin={"10px 0 0 0"}
            >
              Confirm Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
