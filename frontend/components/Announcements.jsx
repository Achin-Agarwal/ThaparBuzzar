import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import InputField from "./Input";
import "../styles/AddProducts.css";
import "../styles/Announcements.css";
import url from "../url";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const Announcements = () => {
  const [services, setServices] = useState([
    {
      id: null,
      rateBifercation: "",
      productImages: [],
      days: "",
      amount: "",
      upi: "",
      paymentConfirmation: [],
    },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      const tokens = localStorage.getItem("authToken");
      const decoded = jwtDecode(tokens);

      if (decoded.role === "seller") {
        try {
          const token = localStorage.getItem("authToken");
          const response = await axios.get(url + "/seller/addannouncement", {
            headers: { authorization: `Bearer ${token}` },
          });
          setServices(
            response.data.services.length > 0
              ? response.data.services
              : [
                  {
                    id: null,
                    rateBifercation: "",
                    productImages: [],
                    days: "",
                    amount: "",
                    paymentConfirmation: [],
                  },
                ]
          );
        } catch (error) {
          console.error("Error fetching services:", error);
        }
        setIsEditable(true)
      } else {
        navigate("/login");
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (index, event) => {
    const { name, value, files } = event.target;

    setServices((prevServices) => {
      const updatedServices = [...prevServices];
      if (name === "productImages" || name === "paymentConfirmation") {
        updatedServices[index][name] = files ? Array.from(files) : [];
      } else {
        updatedServices[index][name] = value;
      }
      return updatedServices;
    });
  };

  const handleSave = async () => {
    const currentService = services[activeIndex];

    if (currentService.id) {
      // Update existing service
      try {
        const response = await axios.patch(
          `${url}/services/${currentService.id}`,
          currentService
        );
        alert(`Service ${activeIndex + 1} updated successfully`);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to update service:", error);
        alert(`Failed to update service ${activeIndex + 1}`);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentService = services[activeIndex];

    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    const formData = new FormData();

    // Append productImages and paymentConfirmation to formData
    currentService.productImages.forEach((image, index) => {
      formData.append(`productImages`, image, image.name || `image1_${index}`);
    });

    currentService.paymentConfirmation.forEach((image, index) => {
      formData.append(`paymentConfirmation`, image, image.name || `image2_${index}`);
    });

    // Append other fields
    formData.append("rateBifercation", currentService.rateBifercation);
    formData.append("days", currentService.days);
    formData.append("amount", currentService.amount);
    // formData.append("upi", currentService.upi);
    formData.append("sellerId", decoded._id);

    try {
      const response = await axios.post(url + "/seller/addannouncement", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)

      setServices((prevServices) => {
        const updatedServices = [...prevServices];
        updatedServices[activeIndex].id = response.data.id;
        return updatedServices;
      });

      alert(`Announcement ${activeIndex + 1} added successfully`);
    } catch (error) {
      console.error("Failed to add service:", error);
      alert(`Failed to add service ${activeIndex + 1}`);
    }
  };

  const handleAddNewService = () => {
    setServices([
      ...services,
      {
        id: null,
        rateBifercation: "",
        productImages: [],
        days: "",
        amount: "",
        upi: "",
        paymentConfirmation: [],
      },
    ]);
    setActiveIndex(services.length);
    setIsEditable(true);
  };

  return (
    <div className="add-products">
      <div className="product-buttons">
        {services.map((service, index) => (
          <Button
            key={`service-${index}`}
            label={service.name || `Announcement ${index + 1}`}
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
        >
          <FaPlus size="25" />
        </Button>
      </div>
      <div className="form">
        <form>
          <textarea
            className="custom-textarea"
            placeholder="Rate Bifercation"
            name="rateBifercation"
            value={services[activeIndex].rateBifercation}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Upload Images 1"
            type="file"
            name="productImages"
            accept="image/*"
            multiple
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Days"
            type="number"
            name="days"
            value={services[activeIndex].days}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Amount"
            type="number"
            name="amount"
            value={services[activeIndex].amount}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="UPI"
            type="text"
            name="upi"
            // value={services[activeIndex].upi}
            value="@uqbja12351"
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={true}
          />
          <InputField
            placeholder="Upload Images 2"
            type="file"
            name="paymentConfirmation"
            accept="image/*"
            multiple
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
        </form>
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
      </div>
    </div>
  );
};

export default Announcements;
