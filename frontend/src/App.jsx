import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Heading from "../components/Heading";
import Home from "../pages/Home";
import Dashboard from "../pages/ProductDashboard";
import Category from "../pages/Category";

const App = () => {
  return (
    <Router>
      <div>
        <Heading />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/category/:category" element={<Category/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;