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
  disabled,
  width,
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
        disabled={disabled}
        style={{ cursor: disabled ? "not-allowed" : "auto" ,width: width}}
        required
        multiple
      />
    </div>
  );
};

export default InputField;
