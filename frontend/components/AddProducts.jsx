import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import InputField from "./Input";
import "../styles/AddProducts.css";
import url from "../url";

const AddProducts = () => {
  const [products, setProducts] = useState([
    {
      id: null,
      name: "",
      category: "",
      price: 0,
      description: "",
      images: [],
      stock: { available: 0 },
      promoCode: { code: "", uses: 0 },
    },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  //   useEffect(() => {
  //     const fetchProducts = async () => {
  //       try {
  //         const response = await axios.get(url + "/products");
  //         setProducts(response.data.products.length > 0 ? response.data.products : [{ id: null,
  // name: "",
  // category: "",
  // price: "",
  // description: "",
  // images: [],
  // stock: { available: 0 },
  // promoCode: { code: "", uses: 0 },}
  // ]);
  //       } catch (error) {
  //         console.error('Error fetching products:', error);
  //         setProducts([{ id: null,
  // name: "",
  // category: "",
  // price: "",
  // description: "",
  // images: [],
  // stock: { available: 0 },
  // promoCode: { code: "", uses: 0 },}]); // Initialize with a blank product if fetching fails
  //       }
  //     };
  //     fetchProducts();
  //   }, []);

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
        stock: { available: 0 },
        promoCode: { code: "", uses: 0 },
      },
    ]);
    setActiveIndex(products.length);
  };

  const handleInputChange = (index, event) => {
    const { name, value, files } = event.target;
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      if (name === "images") {
        updatedProducts[index].images = files ? Array.from(files) : [];
      } else if (name.includes(".")) {
        const [section, field] = name.split(".");
        updatedProducts[index][section][field] = field === "available" || field === "uses" ? Number(value) : value;
      } else {
        updatedProducts[index][name] = name === "price" ? Number(value) : value;
      }
      return updatedProducts;
    });
  };
  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentProduct = products[activeIndex];
  
    if (
      !currentProduct.name ||
      !currentProduct.category ||
      !currentProduct.price ||
      !currentProduct.description ||
      !currentProduct.images.length ||
      currentProduct.stock.available <= 0
    ) {
      const message = `Please fill out all fields for Product ${
        activeIndex + 1
      }`;
      setStatusMessage(message);
      alert(message);
      return;
    }
  
    const formData = new FormData();
    currentProduct.images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("price", Number(currentProduct.price));
    formData.append("name", currentProduct.name);
    formData.append("description", currentProduct.description);
    formData.append("category", formatCategory(currentProduct.category)); // Ensure proper format
    formData.append("stock", JSON.stringify(currentProduct.stock)); // Serialize object
    formData.append("promoCode", JSON.stringify(currentProduct.promoCode)); // Serialize object
    formData.append("vendorId", "your_vendor_id_here"); // Include vendorId
  
    try {
      const response = await axios.post(
        url + "/vendor/addproduct",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProducts((prevProducts) => {
        const updatedProducts = [...prevProducts];
        updatedProducts[activeIndex].id = response.data.id;
        return updatedProducts;
      });
      setStatusMessage(`Product ${activeIndex + 1} added successfully`);
      alert(`Product ${activeIndex + 1} added successfully`);
    } catch (error) {
      console.error(error);
      setStatusMessage(`Failed to add Product ${activeIndex + 1}`);
      alert(`Failed to add Product ${activeIndex + 1}`);
    }
  };
  

  const handleDelete = async (event) => {
    event.preventDefault();
    const currentProduct = products[activeIndex];

    if (!currentProduct.id) {
      setProducts((prevProducts) =>
        prevProducts.filter((_, index) => index !== activeIndex)
      );
      setActiveIndex(0);
      setStatusMessage(`Product ${activeIndex + 1} deleted`);
      return;
    }

    try {
      await axios.delete(`${url}/products/${currentProduct.id}`);
      setProducts((prevProducts) =>
        prevProducts.filter((_, index) => index !== activeIndex)
      );
      setActiveIndex(0);
      setStatusMessage(`Product ${activeIndex + 1} deleted successfully`);
    } catch (error) {
      console.error(error);
      setStatusMessage(`Failed to delete Product ${activeIndex + 1}`);
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
            onClick={() => setActiveIndex(index)}
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
        <form>
          <InputField
            placeholder="Name"
            type="text"
            name="name"
            value={products[activeIndex].name}
            onChange={(event) => handleInputChange(activeIndex, event)}
          />

          <div className="input-field">
            <select
              name="category"
              value={products[activeIndex].category}
              onChange={(event) => handleInputChange(activeIndex, event)}
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Collectibles and Art">Collectibles and Art</option>
              <option value="Beauty">Beauty</option>
              <option value="Services">Services</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <InputField
            placeholder="Price"
            type="number"
            name="price"
            value={products[activeIndex].price}
            onChange={(event) => handleInputChange(activeIndex, event)}
          />
          <InputField
            placeholder="Description"
            type="text"
            name="description"
            value={products[activeIndex].description}
            onChange={(event) => handleInputChange(activeIndex, event)}
          />
          <InputField
            placeholder="Stock"
            type="number"
            name="stock.available"
            value={products[activeIndex].stock?.available || 0}
            onChange={(event) => handleInputChange(activeIndex, event)}
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
          />
          <InputField
            placeholder="Promo code"
            type="text"
            name="promoCode.code"
            value={products[activeIndex].promoCode?.code || ""}
            onChange={(event) => handleInputChange(activeIndex, event)}
          />
          <InputField
            placeholder="Number of uses for Promo Code"
            type="number"
            name="promoCode.numberOfUses"
            value={products[activeIndex].promoCode?.uses || 0}
            onChange={(event) => handleInputChange(activeIndex, event)}
          />
          <div className="action-buttons">
            {products.length > 1 && (
              <Button
                label="Delete"
                onClick={handleDelete}
                bgColor="black"
                color="white"
                fontSize="18px"
              />
            )}
            <Button
              label="Submit"
              onClick={handleSubmit}
              bgColor="black"
              color="white"
              fontSize="18px"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
