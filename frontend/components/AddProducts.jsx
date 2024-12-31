import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import InputField from "./Input";
import "../styles/AddProducts.css";

const AddProducts = () => {
  const [products, setProducts] = useState([
    {
      id: null,
      name: "",
      category: "",
      price: "",
      description: "",
      images: [],
      stock: "",
      code: "",
      uses: "",
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
        name: "",
        category: "",
        price: "",
        description: "",
        images: [],
        stock: "",
        code: "",
        uses: "",
      },
    ]);
    setActiveIndex(products.length);
  };

  const handleInputChange = (index, event) => {
    const { name, value, files } = event.target;
    const updatedProducts = [...products];
    if (name === "images") {
      updatedProducts[index] = {
        ...updatedProducts[index],
        images: files ? Array.from(files) : [], // Convert FileList to an array
      };
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: value,
      };
    }
    setProducts(updatedProducts);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentProduct = products[activeIndex];
  
    if (
      !currentProduct.name ||
      !currentProduct.images.length ||
      !currentProduct.price ||
      !currentProduct.description ||
      !currentProduct.category ||
      !currentProduct.stock
    ) {
      const message = `Please fill out all fields for Product ${activeIndex + 1}`;
      setStatusMessage(message);
      alert(message);
      return;
    }
  console.log(currentProduct);
    const formData = new FormData();
  
    currentProduct.images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("price", currentProduct.price);
    formData.append("name", currentProduct.name);
    formData.append("description", currentProduct.description);
    formData.append("category", currentProduct.category);
    formData.append("code", currentProduct.code);
    formData.append("uses", currentProduct.uses);
    formData.append("stock", currentProduct.stock);
  
    try {
      // Uncomment and adjust the endpoint as needed
      // const response = await axios.post('/api/vendor/product', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });
      const updatedProducts = [...products];
      // updatedProducts[activeIndex].id = response.data.id;
      setProducts(updatedProducts);
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
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home</option>
              <option value="beauty">Beauty</option>
              <option value="sports">Sports</option>
              <option value="other">other</option>
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
            name="stock"
            value={products[activeIndex].stock}
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
            name="code"
            value={products[activeIndex].code}
            onChange={(event) => handleInputChange(activeIndex, event)}
          />
          <InputField
            placeholder="Number of uses for Promo Code"
            type="number"
            name="uses"
            value={products[activeIndex].uses}
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
