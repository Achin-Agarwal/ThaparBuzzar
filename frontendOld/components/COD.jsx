import React, { useState } from "react";
import "../styles/COD.css";

const COD = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="cod-container">
      <div className="cod-options">
        <label className="cod-radio-label">
          <input
            type="radio"
            name="codOption"
            value="Cash on Delivery"
            checked={selectedOption === "Cash on Delivery"}
            onChange={handleChange}
          />
          Cash on Delivery
        </label>
      </div>
      {selectedOption && (
        <p className="cod-selection">
          Selected: <strong>{selectedOption}</strong>
        </p>
      )}
    </div>
  );
};

export default COD;
