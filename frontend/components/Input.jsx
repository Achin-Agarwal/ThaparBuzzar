import React from "react";
import "../styles/Input.css";

const InputField = ({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  accept,
}) => {
  return (
    <div className="input-field">
      <label>
        {label}
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          accept={accept}
          required
        />
      </label>
    </div>
  );
};

export default InputField;
