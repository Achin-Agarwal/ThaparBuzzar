import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import InputField from "./Input";
import "../styles/AddProducts.css";
import url from "../url";
import { MdDeleteOutline } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AddProducts = () => {
  const [products, setProducts] = useState([
    {
      id: null,
      name: "",
      category: "",
      price: "",
      description: "",
      images: [],
      stock: { available: "" },
      promoCode: { code: "", numberOfUses: "" },
    },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const tokens = localStorage.getItem("authToken");
      console.log(tokens);
      const decoded = jwtDecode(tokens);
      console.log("Decoded Token:", decoded);
      if (decoded.role === "seller") {
        try {
          const token = localStorage.getItem("authToken");
          console.log("this is " + token);
          const response = await axios.get(url + "/seller/userproducts", {
            headers: { authorization: `Bearer ${token}` },
          });
          console.log(response.data);
          setProducts(
            response.data.products.length > 0
              ? response.data.products
              : [
                  {
                    id: null,
                    name: "",
                    category: "",
                    price: "",
                    description: "",
                    images: [],
                    stock: { available: "" },
                    promoCode: { code: "", numberOfUses: "" },
                  },
                ]
          );
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
      else{
        navigate("/login");
      }
    };
    fetchProducts();
  }, []);

  const handleAddNewProduct = () => {
    setProducts([
      ...products,
      {
        id: null,
        name: "",
        category: "",
        price: "",
        description: "",
        images: [],
        stock: { available: "" },
        promoCode: { code: "", numberOfUses: "" },
      },
    ]);
    setActiveIndex(products.length);
    setIsEditable(true);
  };

  const handleInputChange = (index, event) => {
    const { name, value, files } = event.target;
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      if (name === "images") {
        updatedProducts[index].images = files ? Array.from(files) : [];
      } else if (name.includes(".")) {
        const [section, field] = name.split(".");
        updatedProducts[index][section][field] =
          field === "available" || field === "numberOfUses"
            ? Number(value)
            : value;
      } else {
        updatedProducts[index][name] = name === "price" ? Number(value) : value;
      }
      return updatedProducts;
    });
  };

  // const formatCategory = (category) => {
  //   return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  // };

  const handleEditToggle = () => {
    setIsEditable((prev) => !prev);
  };

  const handleDelete = async () => {
    const currentProduct = products[activeIndex];
    console.log("current id " + currentProduct._id);
    if (!currentProduct._id) {
      setProducts((prevProducts) =>
        prevProducts.filter((_, index) => index !== activeIndex)
      );
      setActiveIndex(0);
      setStatusMessage(`Product ${activeIndex + 1} deleted`);
      return;
    }

    try {
      await axios.delete(`${url}/seller/delete/${currentProduct._id}`);
      setProducts((prevProducts) =>
        prevProducts.filter((_, index) => index !== activeIndex)
      );
      setActiveIndex(0);
      setStatusMessage(`Product ${activeIndex + 1} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleSave = async () => {
    const currentProduct = products[activeIndex];

    // // Validation
    // if (
    //   !currentProduct.name ||
    //   !currentProduct.category ||
    //   !currentProduct.price ||
    //   !currentProduct.description ||
    //   !currentProduct.images.length ||
    //   currentProduct.stock.available <= 0
    // ) {
    //   alert(`Please fill out all fields for Product ${activeIndex + 1}`);
    //   return;
    // }

    if (currentProduct._id) {
      // Update existing product
      try {
        const response = await axios.patch(
          `${url}/products/${currentProduct._id}`,
          currentProduct
        );
        alert(`Product ${activeIndex + 1} updated successfully`);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to update product:", error);
        alert(`Failed to update Product ${activeIndex + 1}`);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentProduct = products[activeIndex];

    // Debug: Check if images are correctly stored in the state
    console.log("Images to upload:", currentProduct.images);

    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    const formData = new FormData();

    // Append images to formData
    if (currentProduct.images && currentProduct.images.length > 0) {
      currentProduct.images.forEach((image, index) => {
        formData.append(`images`, image, image.name || `image_${index}`);
      });
    } else {
      console.error("No images found to upload.");
    }

    // Append other fields
    formData.append("price", currentProduct.price);
    formData.append("name", currentProduct.name);
    formData.append("description", currentProduct.description);
    formData.append("category", currentProduct.category);
    formData.append("stock", JSON.stringify(currentProduct.stock));
    formData.append("promoCode", JSON.stringify(currentProduct.promoCode));
    formData.append("sellerId", decoded._id);

    // Debug: Log the formData content
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
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

  console.log(products.length);
  return (
    <div className="add-products">
      <div className="product-buttons">
        {products.map((_, index) => (
          <Button
            key={`product-${index}`}
            label={`Product ${index + 1}`}
            onClick={() => {
              setActiveIndex(index);
              setIsEditable(false);
            }}
            isActive={activeIndex === index}
            fontSize="18px"
            border="2px solid black"
          />
        ))}
        <Button
          label="+"
          onClick={handleAddNewProduct}
          isIcon
          borderRadius="5px"
          padding="10px 15px"
          fontSize="18px"
          border="2px solid black"
        />
      </div>
      <div className="form">
        <div className="del-save">
          <Button
            label={isEditable ? "Save" : "Edit"}
            onClick={isEditable ? handleSave : () => setIsEditable(true)}
            bgColor={isEditable ? "black" : "blue"}
            color="white"
            fontSize="18px"
          />
          {products.length > 1 && (
            <Button
              onClick={handleDelete}
              bgColor="red"
              color="white"
              fontSize="18px"
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                Delete <MdDeleteOutline size={24} />
              </span>
            </Button>
          )}
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

          <div className="input-field1">
            <select
              name="category"
              value={products[activeIndex].category}
              onChange={(event) => handleInputChange(activeIndex, event)}
              disabled={!isEditable}
              style={{ cursor: !isEditable ? "not-allowed" : "auto" }}
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Collectibles and Art">Collectibles and Art</option>
              <option value="Beauty">Beauty</option>
              <option value="Services">Services</option>
              <option value="Other">Other</option>
              disabled={!isEditable}
            </select>
          </div>

          <InputField
            placeholder="Price"
            type="number"
            name="price"
            value={products[activeIndex].price}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Description"
            type="text"
            name="description"
            value={products[activeIndex].description}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Stock"
            type="number"
            name="stock.available"
            value={products[activeIndex].stock?.available || ""}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          {/* <InputField
            placeholder="Estimated delivery"
            type="text"
            name="delivery"
            value={products[activeIndex].delivery}
            onChange={(event) => handleInputChange(activeIndex, event)}
          /> */}
          {/* <h1>Product Colours</h1> */}
          {/* <InputField
            placeholder="Color name"
            type="text"
            name="colorName"
            value={products[activeIndex].colorName}
            onChange={(event) => handleInputChange(activeIndex, event)}
          /> */}
          <InputField
            placeholder="Images"
            type="file"
            name="images"
            accept="image/*"
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Promo code"
            type="text"
            name="promoCode.code"
            value={products[activeIndex].promoCode?.code || ""}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          <InputField
            placeholder="Number of uses for Promo Code"
            type="number"
            name="promoCode.numberOfUses"
            value={products[activeIndex].promoCode?.numberOfUses || ""}
            onChange={(event) => handleInputChange(activeIndex, event)}
            disabled={!isEditable}
          />
          {products[activeIndex].id === null && (
            <div className="action-buttons">
              <Button
                label="Submit"
                type="submit"
                bgColor="black"
                color="white"
                fontSize="18px"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
