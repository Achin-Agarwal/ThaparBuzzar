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
  const [products, setProducts] = useState([
    {
      id: null,
      name: "",
      email: "",
      phone: "",
      addresses: [{ city: "", state: "", pincode: "" }],
      images: [],
    },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      //   const token = localStorage.getItem("authToken");
      //   const decoded = jwtDecode(token);

      try {
        const response = await axios.get(url + "/seller/userproducts", {
          headers: { authorization: `Bearer ${token}` },
        });
        setProducts(
          response.data.products.length > 0
            ? response.data.products
            : [
                {
                  id: null,
                  name: "",
                  email: "",
                  phone: "",
                  addresses: [{ city: "", state: "", pincode: "" }],
                  images: [],
                },
              ]
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (index, event) => {
    const { name, value, files } = event.target;
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      if (name === "images") {
        updatedProducts[index].images = files ? Array.from(files) : [];
      } else if (name.includes(".")) {
        const [section, field] = name.split(".");
        updatedProducts[index][section][field] = value;
      } else {
        updatedProducts[index][name] = value;
      }
      return updatedProducts;
    });
  };

  const handleAddressChange = (index, addressIndex, event) => {
    const { name, value } = event.target;
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].addresses[addressIndex][name] = value;
      return updatedProducts;
    });
  };

  const addAddress = (index) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].addresses.push({
        city: "",
        state: "",
        pincode: "",
      });
      return updatedProducts;
    });
  };

  const deleteAddress = (index, addressIndex) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].addresses.splice(addressIndex, 1);
      return updatedProducts;
    });
  };

  const handleSave = async () => {
    const currentProduct = products[activeIndex];

    try {
      const response = await axios.patch(
        `${url}/products/${currentProduct.id}`,
        currentProduct
      );
      alert(`Product ${activeIndex + 1} updated successfully`);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert(`Failed to update Product ${activeIndex + 1}`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentProduct = products[activeIndex];

    const formData = new FormData();
    if (currentProduct.images.length > 0) {
      currentProduct.images.forEach((image, index) => {
        formData.append(`images`, image, image.name || `image_${index}`);
      });
    }

    formData.append("name", currentProduct.name);
    formData.append("email", currentProduct.email);
    formData.append("phone", currentProduct.phone);
    formData.append("addresses", JSON.stringify(currentProduct.addresses));

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(url + "/seller/addproduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
      setProducts((prevProducts) => {
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

  return (
    <div className="user-profile">
      <div className="form-container">
        <div className="action-buttons">
          <Button
            label={isEditable ? "Save Changes" : "Edit"}
            onClick={isEditable ? handleSave : () => setIsEditable(true)}
            bgColor={isEditable ? "black" : "blue"}
            color="white"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <InputField
            placeholder="Name"
            type="text"
            name="name"
            value={products[activeIndex].name}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Email"
            type="email"
            name="email"
            value={products[activeIndex].email}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Phone Number"
            type="text"
            name="phone"
            value={products[activeIndex].phone}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Images"
            type="file"
            name="images"
            accept="image/*"
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <div className="address-container">
            <h2>Addresses:</h2>
          </div>
          <div className="address-fields-container">
            {products[activeIndex].addresses.map((address, addressIndex) => (
              <div key={addressIndex} className="address-fields">
                <InputField
                  placeholder="City"
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={(event) =>
                    handleAddressChange(activeIndex, addressIndex, event)
                  }
                  disabled={!isEditable}
                  width="80%"
                />
                <InputField
                  placeholder="State"
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={(event) =>
                    handleAddressChange(activeIndex, addressIndex, event)
                  }
                  disabled={!isEditable}
                  width="80%"
                />
                <InputField
                  placeholder="Pincode"
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={(event) =>
                    handleAddressChange(activeIndex, addressIndex, event)
                  }
                  disabled={!isEditable}
                  width="80%"
                />
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
