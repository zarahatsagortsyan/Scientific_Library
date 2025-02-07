import React, { useState } from "react";
import "./Register.css";
import PhoneNumberInput from "../../Components/PhoneNumbers/PhoneNumberInput";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const RegisterPublisher: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfEstablishment, setDateOfEstablishment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Store the local phone number
  //   const [countryCode, setCountryCode] = useState("+1"); // Store the country code
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (
      !email ||
      !password ||
      !dateOfEstablishment ||
      !phoneNumber ||
      !companyName
    ) {
      setError("All fields are required.");
    } else {
      setError("");
      // Here, you can send the phoneNumber and countryCode separately to the backend
      alert(`Publisher Registered! \nFull phone number: ${phoneNumber}`);
    }
  };

  return (
    <div className="registration-form-container">
      <div className="registration-form">
        <h2>Register as Publisher</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)} // Directly update state
              placeholder="Enter your company name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Directly update state
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Directly update state
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Establishment</label>
            <input
              type="date"
              id="dob"
              value={dateOfEstablishment}
              onChange={(e) => setDateOfEstablishment(e.target.value)} // Directly update state
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

export default RegisterPublisher;
