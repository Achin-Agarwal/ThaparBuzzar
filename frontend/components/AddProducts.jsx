import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import InputField from "./Input";
import "../styles/AddProducts.css";

const AddProducts = () => {
  const [products, setProducts] = useState([
    {
      id: null,
      domain: "",
      type: "",
      name: "",
      price: "",
      description: "",
      delivery: "",
      image: null,
      quantity: "",
      code:"",
    },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  //   useEffect(() => {
  //     const fetchProducts = async () => {
  //       try {
  //         const response = await axios.get('/api/vendor/products');
  //         setProducts(response.data.products.length > 0 ? response.data.products : [{ id: null,domain:'',type:'', name: '', price: '' ,description:'',delivery:'',colorName:'', image: null, quantity:''}]);
  //       } catch (error) {
  //         console.error('Error fetching products:', error);
  //         setProducts([{ id: null,domain:'',type:'', name: '', price: '' ,description:'',delivery:'',colorName:'', image: null, quantity:''}]); // Initialize with a blank product if fetching fails
  //       }
  //     };
  //     fetchProducts();
  //   }, []);

  const handleAddNewProduct = () => {
    setProducts([
      ...products,
      {
        id: null,
        domain: "",
        type: "",
        name: "",
        price: "",
        description: "",
        delivery: "",
        image: null,
        quantity: "",
        code:"",
      },
    ]);
    setActiveIndex(products.length);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const updatedProducts = [...products];
    updatedProducts[activeIndex] = {
      ...updatedProducts[activeIndex],
      [name]: name === "image" ? files[0] : value,
    };
    setProducts(updatedProducts);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentProduct = products[activeIndex];
    if (
      !currentProduct.name ||
      !currentProduct.image ||
      !currentProduct.price ||
      !currentProduct.description ||
      !currentProduct.delivery ||
      !currentProduct.colorName ||
      !currentProduct.quantity
    ) {
      setStatusMessage(
        `Please fill out all fields for Product ${activeIndex + 1}`
      );
      alert(statusMessage);
      return;
    }

    const formData = new FormData();
    formData.append("image", currentProduct.image);
    formData.append("price", currentProduct.price);
    formData.append("name", currentProduct.name);
    formData.append("domain", currentProduct.domain);
    formData.append("type", currentProduct.type);
    formData.append("description", currentProduct.description);
    formData.append("delivery", currentProduct.delivery);
    formData.append("quantity", currentProduct.quantity);
    formData.append("code", currentProduct.code);
    console.log(currentProduct);

    try {
      //   const response = await axios.post('/api/vendor/product', formData, {
      //     headers: { 'Content-Type': 'multipart/form-data' },
      //   });
      const updatedProducts = [...products];
      //   updatedProducts[activeIndex].id = response.data.id;
      setProducts(updatedProducts);
      setStatusMessage(`Product ${activeIndex + 1} added successfully`);
      alert(statusMessage);
    } catch (error) {
      console.error(error);
      setStatusMessage(`Failed to add Product ${activeIndex + 1}`);
      alert(statusMessage);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const currentProduct = products[activeIndex];

    if (!currentProduct.id) {
      const updatedProducts = products.filter(
        (_, index) => index !== activeIndex
      );
      setProducts(updatedProducts);
      setActiveIndex(0);
      setStatusMessage(`Product ${activeIndex + 1} deleted`);
      alert(statusMessage);
      return;
    }

    try {
      //   await axios.delete(`/api/vendor/product/${currentProduct.id}`);
      //   const updatedProducts = products.filter((_, index) => index !== activeIndex);
      //   setProducts(updatedProducts);
      setActiveIndex(0);
      setStatusMessage(`Product ${activeIndex + 1} deleted successfully`);
      alert(statusMessage);
    } catch (error) {
      console.error(error);
      setStatusMessage(`Failed to delete Product ${activeIndex + 1}`);
      alert(statusMessage);
    }
  };
  console.log(products.length);
  return (
    <div className="add-products">
      <div className="product-buttons">
        {products.map((_, index) => (
          <Button
            key={index}
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
            type="text"
            name="domain"
            placeholder="Product domain"
            value={products[activeIndex].domain}
            onChange={handleChange}
          />
          <InputField
            type="text"
            name="type"
            placeholder="Product type"
            value={products[activeIndex].type}
            onChange={handleChange}
          />
          <InputField
            placeholder="Product name"
            type="text"
            name="name"
            value={products[activeIndex].name}
            onChange={handleChange}
          />
          <InputField
            placeholder="Product price"
            type="number"
            name="price"
            value={products[activeIndex].price}
            onChange={handleChange}
          />
          <InputField
            placeholder="Product description"
            type="text"
            name="description"
            value={products[activeIndex].description}
            onChange={handleChange}
          />
          <InputField
            placeholder="Estimated delivery"
            type="text"
            name="delivery"
            value={products[activeIndex].delivery}
            onChange={handleChange}
          />
          {/* <h1>Product Colours</h1> */}
          {/* <InputField
            placeholder="Color name"
            type="text"
            name="colorName"
            value={products[activeIndex].colorName}
            onChange={handleChange}
          /> */}
          <InputField
            placeholder="Product picture"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <InputField
            placeholder="Product quantity"
            type="number"
            name="quantity"
            value={products[activeIndex].quantity}
            onChange={handleChange}
          />
          <InputField
            placeholder="Promo code"
            type="number"
            name="code"
            value={products[activeIndex].code}
            onChange={handleChange}
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
