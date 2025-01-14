import React, { useEffect, useState } from "react";
import "../styles/Address.css";
import InputField from "../components/Input";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import url from "../url";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(url + "/buyer/getalldetails", {
          headers: { authorization: `Bearer ${token}` },
        });
        console.log(response.data.deals);
        setAddresses(response.data.deals.address || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddress();
  }, []);
  return (
    <div className="addressFieldsContainer">
      <div className="addressFields">
      <InputField
          placeholder="Room Number"
          type="text"
          name="roomNumber"
          value={
            addresses?.roomNumber === "Not Provided"
              ? ""
              : addresses?.roomNumber || ""
          }
          disabled={true}
          width="80%"
        />
        <InputField
          placeholder="Floor"
          type="text"
          name="floor"
          value={
            addresses?.floor === "Not Provided"
              ? ""
              : addresses?.floor || ""
          }
          disabled={true}
          width="80%"
        />
        <InputField
          placeholder="Hostel"
          type="text"
          name="hostel"
          value={
            addresses?.hostel === "Not Provided"
              ? ""
              : addresses?.hostel || ""
          }
          disabled={true}
          width="80%"
        />
        <InputField
          placeholder="City"
          type="text"
          name="city"
          value={
            addresses?.city === "Not Provided"
              ? ""
              : addresses?.city || ""
          }
          disabled={true}
          width="80%"
        />
      </div>
    </div>
  );
};

export default Address;
