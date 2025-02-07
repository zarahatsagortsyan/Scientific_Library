import React, { useState } from "react";
import "./Register.css"; // Optional: Add styles for the form
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
const RegisterReader: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Store the local phone number
  const [countryCode, setCountryCode] = useState("+1"); // Store the country code
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (
      !name ||
      !email ||
      !password ||
      !dateOfBirth ||
      !phoneNumber ||
      !countryCode
    ) {
      setError("All fields are required.");
    } else {
      setError("");
      // Handle form submission (e.g., API call)
      alert("Reader Registered!");
    }
  };

  return (
    <div className="registration-form-container">
      <div className="registration-form">
        <h2>Register as Reader</h2>
        {error && <p className="error">{error}</p>}
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
          {/* Use the PhoneNumberInput Component
          <PhoneNumberInput
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            onCountryCodeChange={setCountryCode} // Directly update state
            onPhoneNumberChange={setPhoneNumber} // Directly update state
          /> */}
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
