import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    onSearch(inputValue.trim());
  };

  return (
    <div style={{ margin: "20px 0", display: "flex", gap: "10px" }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by username..."
        style={{ flex: "1", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
      />
      <button onClick={handleSearch} style={{ padding: "10px 20px", backgroundColor: "black", color: "white" }}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
