import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import InputField from "./Input";
import "../styles/AddProducts.css";
import url from "../url";
import { MdDeleteOutline } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const Service = () => {
  const [services, setServices] = useState([
    {
      id: null,
      name: "",
      domain: "",
      price: "",
      description: "",
      images: [],
      mobileNumber: "",
      additionalInfo: "",
    },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      const tokens = localStorage.getItem("authToken");
      console.log(tokens);
      const decoded = jwtDecode(tokens);
      console.log("Decoded Token:", decoded);
      if (decoded.role === "seller") {
        try {
          const token = localStorage.getItem("authToken");
          console.log("this is " + token);
          const response = await axios.get(url + "/seller/userservices", {
            headers: { authorization: `Bearer ${token}` },
          });
          console.log(response.data);
          setServices(
            response.data.services.length > 0
              ? response.data.services
              : [
                  {
                    id: null,
                    name: "",
                    domain: "",
                    price: "",
                    description: "",
                    images: [],
                    mobileNumber: "",
                    additionalInfo: "",
                  },
                ]
          );
        } catch (error) {
          console.error("Error fetching services:", error);
        }
      } else {
        navigate("/login");
      }
    };
    fetchServices();
  }, []);

  const handleAddNewService = () => {
    setServices([
      ...services,
      {
        id: null,
        name: "",
        domain: "",
        price: "",
        description: "",
        images: [],
        mobileNumber: "",
        additionalInfo: "",
      },
    ]);
    setActiveIndex(services.length);
    setIsEditable(true);
  };

  const handleInputChange = (index, event) => {
    const { name, value, files } = event.target;
    setServices((prevServices) => {
      const updatedServices = [...prevServices];
      if (name === "images") {
        updatedServices[index].images = files ? Array.from(files) : [];
      } else if (name.includes(".")) {
        const [section, field] = name.split(".");
        updatedServices[index][section][field] =
          field === "available" || field === "numberOfUses"
            ? Number(value)
            : value;
      } else {
        updatedServices[index][name] = name === "price" ? Number(value) : value;
      }
      return updatedServices;
    });
  };

  // const formatCategory = (category) => {
  //   return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  // };

  const handleEditToggle = () => {
    setIsEditable((prev) => !prev);
  };

  const handleDelete = async () => {
    const currentService = services[activeIndex];
    console.log("current id " + currentService._id);
    if (!currentService._id) {
      setServices((prevServices) =>
        prevServices.filter((_, index) => index !== activeIndex)
      );
      setActiveIndex(0);
      setStatusMessage(`Service ${activeIndex + 1} deleted`);
      return;
    }

    try {
      await axios.delete(`${url}/seller/deleteservice/${currentService._id}`);
      setServices((prevServices) =>
        prevServices.filter((_, index) => index !== activeIndex)
      );
      setActiveIndex(0);
      setStatusMessage(`Service ${activeIndex + 1} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const handleSave = async () => {
    const currentService = services[activeIndex];

    // // Validation
    // if (
    //   !currentService.name ||
    //   !currentService.category ||
    //   !currentService.price ||
    //   !currentService.description ||
    //   !currentService.images.length ||
    //   currentService.stock.available <= 0
    // ) {
    //   alert(`Please fill out all fields for Service ${activeIndex + 1}`);
    //   return;
    // }

    if (currentService._id) {
      // Update existing Service
      try {
        const response = await axios.patch(
          `${url}/services/${currentService._id}`,
          currentService
        );
        alert(`Service ${activeIndex + 1} updated successfully`);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to update Service:", error);
        alert(`Failed to update Service ${activeIndex + 1}`);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentService = services[activeIndex];

    // Debug: Check if images are correctly stored in the state
    console.log("Images to upload:", currentService.images);

    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    const formData = new FormData();

    // Append images to formData
    if (currentService.images && currentService.images.length > 0) {
      currentService.images.forEach((image, index) => {
        formData.append(`images`, image, image.name || `image_${index}`);
      });
    } else {
      console.error("No images found to upload.");
    }

    // Append other fields
    formData.append("price", currentService.price);
    formData.append("name", currentService.name);
    formData.append("description", currentService.description);
    formData.append("sellerId", decoded._id);
    formData.append("domain", currentService.domain);
    formData.append("mobileNumber", currentService.mobileNumber);
    formData.append("additionalInfo", currentService.additionalInfo);

    // Debug: Log the formData content
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(url + "/seller/addservices", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
      setServices((prevServices) => {
        const updatedServices = [...prevServices];
        updatedServices[activeIndex].id = response.data.id;
        return updatedServices;
      });
      alert(`Service ${activeIndex + 1} added successfully`);
    } catch (error) {
      console.error("Failed to add Service:", error);
      alert(`Failed to add Service ${activeIndex + 1}`);
    }
  };

  console.log(services.length);
  return (
    <div className="add-products">
      <div className="product-buttons">
        {services.map((service, index) => (
          <Button
            key={`service-${index}`}
            label={service.name || `Service ${index + 1}`}
            onClick={() => {
              setActiveIndex(index);
              setIsEditable(false);
            }}
            isActive={activeIndex === index}
            fontSize="18px"
            border="2px solid black"
            borderRadius="16px"
            padding="10px 15px"
            margin="0 10px"
            bgColor="black"
          />
        ))}
        <Button
          onClick={handleAddNewService}
          borderRadius="15px"
          padding="0px 8px"
          fontSize="18px"
          border="2px solid black"
            margin="0 10px"
            bgColor="black"
            color="white"
        ><FaPlus size="25"/></Button>
      </div>
      <div className="form">
        <div className="del-save">
          <Button
            label={isEditable ? "Save" : "Edit"}
            onClick={isEditable ? handleSave : () => setIsEditable(true)}
            bgColor={isEditable ? "black" : "blue"}
            color="white"
            fontSize="18px"
            borderRadius="12px"
          />
          {services.length > 1 && (
            <Button
              onClick={handleDelete}
              bgColor="red"
              color="white"
              fontSize="18px"
              borderRadius="12px"
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                Delete <MdDeleteOutline size={24} />
              </span>
            </Button>
          )}
        </div>
        <form>
        <InputField
            placeholder="Domain"
            type="text"
            name="domain"
            value={services[activeIndex].domain}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Name"
            type="text"
            name="name"
            value={services[activeIndex].name}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Price"
            type="number"
            name="price"
            value={services[activeIndex].price}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Description"
            type="text"
            name="description"
            value={services[activeIndex].description}
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
          <InputField
            placeholder="Contact Details"
            type="text"
            name="mobileNumber"
            value={services[activeIndex].mobileNumber}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Additional Infomation"
            type="number"
            name="additionalInfo"
            value={services[activeIndex].additionalInfo}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
        </form>
        {services[activeIndex].id === null && (
            <div className="action-buttons">
              <Button
                label="Submit"
                type="submit"
                bgColor="black"
                color="white"
                fontSize="18px"
                borderRadius="12px"
                onClick={handleSubmit}
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default Service;
