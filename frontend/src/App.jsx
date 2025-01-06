import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Heading from "../components/Heading";
import Home from "../pages/Home";
import Dashboard from "../pages/ProductDashboard";
import Category from "../pages/Category";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Create from "../pages/Create";
import Forgot from "../pages/Forgot";
import Reset from "../pages/Reset";
import Newpassword from "../pages/Newpassword";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="259928608339-d30a5jjbiv1btq8rt2ibg6d5oid4hndm.apps.googlebuyercontent.com">
        <Login />
      </GoogleOAuthProvider>
    );
  };
  return (
    <Router>
      <div>
        <Heading />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<GoogleAuthWrapper />} />
          <Route path="/create" element={<Create />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/newpassword" element={<Newpassword />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
