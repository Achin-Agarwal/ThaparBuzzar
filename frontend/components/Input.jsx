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
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type={type}
        name={name}
        {...(type !== "file" && { value })}
        placeholder={placeholder}
        onChange={onChange}
        accept={accept}
        required
        multiple
      />
    </div>
  );
};

export default InputField;
