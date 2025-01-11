import React, { useState } from "react";
import "../styles/Admin.css";
import RequestsList from "./RequestsList";
import SearchBar from "./Search";

const Admin= () => {
  const [activeTab, setActiveTab] = useState("pendingAnnouncements");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  return (
    <div className="admin-dashboard">
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
