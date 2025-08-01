import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import InputField from "./Input";
import "../styles/UserProfile.css";
import url from "../url";
// import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";

const UserProfile = () => {
  const [deals, setDeals] = useState([
    {
      id: null,
      name: "",
      email: "",
      phoneNumber: "",
      address: { roomNumber: "", floor: "", city: "", hostel: "" },
      // images: [],
    },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(url + "/buyer/getalldetails", {
          headers: { authorization: `Bearer ${token}` },
        });
        console.log(response.data.deals);
        setDeals(response.data.deals);
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (event) => {
    console.log("event", event);
    const { name, value } = event.target;
    setDeals((prevDeals) => ({
      ...prevDeals,
      [name]: value,
    }));
  };
  // const handleAddressChange = (event) => {
  //   console.log("event", event.target);
  //   const { name, value } = event.target;
  //   console.log(name, value);

  //   // setDeals((prevDeals) => {
  //   //   const updatedDeals = [...prevDeals];
  //   //   updatedDeals[activeIndex].address = {
  //   //     ...updatedDeals[activeIndex].address,
  //   //     [name]: value,
  //   //   };
  //   //   return updatedDeals;
  //   // });
  // };

  const handleAddressChange = (event) => {
    console.log(event.target);
    const { name, value } = event.target;
    console.log(name, value);

    setDeals((prevDeals) => ({
      ...prevDeals,
      address: {
        ...prevDeals.address,
        [name]: value,
      },
    }));
  };

  const handleSave = async () => {
    console.log("currentProduct", deals);
    if (
      deals.address.roomNumber === "" ||
      deals.address.floor === "" ||
      deals.address.city === "" ||
      deals.address.hostel === "" ||
      deals.name === "" ||
      deals.phoneNumber === ""
    ) {
      alert("Please fill all the fields");
      return;
    }
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.patch(`${url}/buyer/updateprofile`, deals, {
        headers: { authorization: `Bearer ${token}` },
      });
      alert(`Profile updated successfully`);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert(`Failed to update Product ${activeIndex + 1}`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentProduct = deals[activeIndex];

    const formData = new FormData();
    // if (currentProduct.images.length > 0) {
    //   currentProduct.images.forEach((image, index) => {
    //     formData.append(`images`, image, image.name || `image_${index}`);
    //   });
    // }

    formData.append("name", currentProduct.name);
    formData.append("email", currentProduct.email);
    formData.append("phoneNumber", currentProduct.phoneNumber);
    formData.append("address", JSON.stringify(currentProduct.address));

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(url + "/seller/addproduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
      setDeals((prevProducts) => {
        const updatedProducts = [...prevProducts];
        updatedProducts[activeIndex].id = response.data.id;
        return updatedProducts;
      });
      alert(`Product ${activeIndex + 1} added successfully`);
    } catch (error) {
      console.error("Failed to add product:", error);
      alert(`Failed to add Product ${activeIndex + 1}`);
    }
  };
  console.log("this us ", deals);

  return (
    <div className="user-profile">
      <div className="form-container">
        <div className="action-buttons">
          <Button
            label={isEditable ? "Save Changes" : "Edit"}
            onClick={isEditable ? handleSave : () => setIsEditable(true)}
            bgColor={isEditable ? "black" : "blue"}
            color="white"
            fontSize="18px"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <InputField
            placeholder="Name"
            type="text"
            name="name"
            value={deals.name}
            onChange={(event) => handleInputChange(event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Email"
            type="email"
            name="email"
            value={deals.email?.address}
            onChange={(event) => handleInputChange(event)}
            disabled={true}
          />
          <InputField
            placeholder="Phone Number"
            type="text"
            name="phoneNumber"
            value={
              deals.phoneNumber === "Not Provided"
                ? ""
                : deals.phoneNumber || ""
            }
            onChange={(event) => handleInputChange(event)}
            disabled={!isEditable}
          />
          {/* <InputField
            placeholder="Images"
            type="file"
            name="images"
            accept="image/*"
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          /> */}
          <div className="address-container">
            <h2>Address:</h2>
          </div>
          <div className="address-fields-container">
            {/* {deals.address.map((add, addressIndex) => ( */}
            <div className="address-fields">
              <InputField
                placeholder="Room Number"
                type="text"
                name="roomNumber"
                value={
                  deals.address?.roomNumber === "Not Provided"
                    ? ""
                    : deals.address?.roomNumber || ""
                }
                onChange={(event) => handleAddressChange(event)}
                disabled={!isEditable}
                width="80%"
              />
              <InputField
                placeholder="Floor"
                type="text"
                name="floor"
                value={
                  deals.address?.floor === "Not Provided"
                    ? ""
                    : deals.address?.floor || ""
                }
                onChange={(event) => handleAddressChange(event)}
                disabled={!isEditable}
                width="80%"
              />
              <InputField
                placeholder="Hostel"
                type="text"
                name="hostel"
                value={
                  deals.address?.hostel === "Not Provided"
                    ? ""
                    : deals.address?.hostel || ""
                }
                onChange={(event) => handleAddressChange(event)}
                disabled={!isEditable}
                width="80%"
              />
              <InputField
                placeholder="City"
                type="text"
                name="city"
                value={
                  deals.address?.city === "Not Provided"
                    ? ""
                    : deals.address?.city || ""
                }
                onChange={(event) => handleAddressChange(event)}
                disabled={!isEditable}
                width="80%"
              />
            </div>
            {/* ))} */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
