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
import Verify from "../pages/Verify";
import Otp from "../pages/Otp";
import "./App.css";
import BuyerDashboard from "../pages/BuyerDashboard";
import UserProfile from "../components/UserProfile";
import Orders from "../components/Orders";
import Service from "../components/Service";
import Announcements from "../components/Announcements";
import BuyNow from "../pages/BuyNow";
import COD from "../components/COD";
import AdminLogin from "../pages/AdminLogin";
import Admin from "../pages/Admin";
import RequestDetail from "../pages/RequestDetail";
import Sale from "../pages/Sale";
import Privacy from "../pages/Privacy";
import About from "../pages/About";
import Search from "../components/Search";
import Fetched from "../pages/Fetched";

const App = () => {
  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="571916729376-u7cv5rn9evqb63rjs074gh8p3l47gjvr.apps.googleusercontent.com">
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
          <Route path="/verify" element={<Verify/>} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/buyer" element={<BuyerDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/service" element={<Service/>} />
          <Route path="/announcement" element={<Announcements/>} />
          <Route path="/buynow" element={<BuyNow/>} />
          <Route path="/cod" element={<COD/>} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/request/:id" element={<RequestDetail />} />
          <Route path="/sale/:sale" element={<Sale />} />
          <Route path="/privacy" element={<Privacy/>} />
          <Route path="/about" element={<About/>}/>
          <Route path="/search" element={<Search />} />
          <Route path="/searched/" element={<Fetched />} />
          <Route path="/about" element={<About/>}/>
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
