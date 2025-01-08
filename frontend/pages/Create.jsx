import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import InputField from "../components/Input";
import "../styles/Create.css";
import url from "../url";

const Create = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role;
  const email = location.state?.email;
  console.log(role);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: email,
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    passwordMismatch: false,
    weakPassword: false,
    userExists: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password" || name === "confirmPassword") {
      validatePasswords(
        name === "password" ? value : formData.password,
        name === "confirmPassword" ? value : formData.confirmPassword
      );
    }
  };

  const validatePasswords = (password, confirmPassword) => {
    const passwordMismatch = password !== confirmPassword;
    const weakPassword =
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(
        password
      );

    setErrors({
      ...errors,
      passwordMismatch,
      weakPassword,
    });
  };

  const isFormValid = () => {
    console.log(errors);
    return (
      !errors.passwordMismatch &&
      !errors.weakPassword &&
      formData.email &&
      formData.dateOfBirth &&
      formData.password &&
      formData.confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (!isFormValid()) return;

    setLoading(true);
    setErrors({ ...errors, userExists: "" });

    try {
      const response = await axios.post(url + "/createnewaccount", {
        ...formData,
        role,
      });
      const token = localStorage.setItem("authToken", response.data.token);
      if (response.data.message === "Buyer account created successfully") {
        if (role === "seller") {
          console.log("seller");
          navigate("/dashboard");
        } else {
          console.log("buyer");
          navigate("/buyer",{state:{response:response.data}});
        }
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          userExists: response.data.message,
        }));
      }
      alert(
        `${
          role.charAt(0).toUpperCase() + role.slice(1)
        } account created successfully!`
      );
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setErrors({
          ...errors,
          userExists: "User already exists. Please login or use another email.",
        });
      } else {
        setErrors({
          ...errors,
          userExists: "An error occurred. Please try again later.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <h2>Create {role.charAt(0).toUpperCase() + role.slice(1)} Account</h2>
      <form className="create-form" onSubmit={handleSubmit}>
        {role === "seller" ? (
          <InputField
            placeholder="Enter Your Company Name"
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
        ) : (
          <InputField
            placeholder="Enter your Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        )}
        <InputField
          text="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          disabled
        />
        <InputField
          text="Date of Birth"
          type="date"
          name="dateOfBirth"
          placeholder="Enter your date of birth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
        <InputField
          text="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.weakPassword && (
          <p className="error">
            Password must be at least 8 characters long and include an uppercase
            letter, a number, and a special character.
          </p>
        )}
        <InputField
          text="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.passwordMismatch && (
          <p className="error">Passwords do not match.</p>
        )}
        {errors.userExists && <p className="error">{errors.userExists}</p>}
        <button
          className="submit-button"
          type="submit"
          disabled={!isFormValid() || loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Create;
