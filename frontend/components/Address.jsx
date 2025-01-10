import React, { useState } from "react";
import "../styles/Address.css";
import InputField from "../components/Input";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const Address = () => {
  const [addresses, setAddresses] = useState([
    { city: "New York", state: "NY", pincode: "10001" },
  ]);
  const navigate=useNavigate();

  // Uncomment and use the following for dynamic data fetching
  // useEffect(() => {
  //   const fetchAddress = async () => {
  //     try {
  //       const response = await axios.get("url-to-fetch-address", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setAddresses(response.data.addresses || []);
  //     } catch (error) {
  //       console.error("Error fetching addresses:", error);
  //     }
  //   };
  //   fetchAddress();
  // }, []);

  const handleEdit = () => {
    navigate("/buyer");
  }

  return (
    <div className="addressFieldsContainer">
      {addresses.map((address, index) => (
        <div key={index} className="addressFields">
          <InputField
            placeholder="City"
            type="text"
            name="city"
            value={address.city}
            disabled={true}
            width="80%"
          />
          <InputField
            placeholder="State"
            type="text"
            name="state"
            value={address.state}
            disabled={true}
            width="80%"
          />
          <InputField
            placeholder="Pincode"
            type="text"
            name="pincode"
            value={address.pincode}
            disabled={true}
            width="80%"
          />
        </div>
      ))}
    </div>
  );
};

export default Address;
