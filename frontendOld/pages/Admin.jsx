import React, { useEffect, useState } from "react";
import "../styles/Admin.css";
import RequestsList from "./RequestsList";
import SearchBar from "./Search";
import Button from "../components/Button";
import { jwtDecode } from "jwt-decode";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("pendingAnnouncements");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          window.location.href = "/adminlogin";
        } else {
          const decode = jwtDecode(token);
          console.log(decode);
          if (decode.role != "admin") {
            window.location.href = "/adminlogin";
          }
          else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        window.location.href = "/adminlogin";
      }
    };
    fetch();
  }, []);
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };
  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/adminlogin";
  };

  return (
    <div className="admin-dashboard">
      <Button bgColor="black" onClick={logout}>
        Logout
      </Button>
      <SearchBar onSearch={setSearchQuery} />
      <div className="tab-buttons">
        <button
          onClick={() => handleTabChange("pendingAnnouncements")}
          className={activeTab === "pendingAnnouncements" ? "active" : ""}
        >
          Pending
        </button>
        <button
          onClick={() => handleTabChange("approvedAnnouncements")}
          className={activeTab === "approvedAnnouncements" ? "active" : ""}
        >
          Approved
        </button>
        <button
          onClick={() => handleTabChange("disapprovedAnnouncements")}
          className={activeTab === "disapprovedAnnouncements" ? "active" : ""}
        >
          Disapproved
        </button>
      </div>
      <RequestsList status={activeTab} searchQuery={searchQuery} />
    </div>
  );
};

export default Admin;
