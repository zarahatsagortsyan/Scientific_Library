import React, { useState } from "react";
import "./Register.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useNavigate } from "react-router-dom";

const RegisterReader: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!name || !email || !password || !dateOfBirth || !phoneNumber) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setSuccessMessage("");

    // Prepare the payload
    const payload = {
      email,
      userName: name,
      password,
      birthDate: new Date(dateOfBirth).toISOString(),
      phone: phoneNumber,
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL; // Ensure your env variable is set
      const response = await fetch(`${apiUrl}/Auth/register/reader`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data.succeeded) {
        // Registration successful
        setError("");
        setSuccessMessage("Registration successful! You may now log in.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        // If errors are present
        const errorDescriptions =
          data.data.errors?.map((err: any) => err.description).join("\n ") ||
          "Registration failed.";
        setError(errorDescriptions);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="registration-form-container">
      <div className="registration-form">
        <h2>Register as Reader</h2>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          <div className="phone-input-container">
            <PhoneInput
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterReader;
