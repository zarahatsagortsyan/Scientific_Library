import React, { useState } from "react";
import "./Register.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useNavigate } from "react-router-dom";

const RegisterPublisher: React.FC = () => {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfEstablishment, setDateOfEstablishment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (
      !companyName ||
      !email ||
      !password ||
      !dateOfEstablishment ||
      !phoneNumber
    ) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setSuccessMessage("");

    // Prepare the payload
    const payload = {
      email,
      // userName: companyName,
      password,
      EstablishDate: new Date(dateOfEstablishment).toISOString(),
      companyName: companyName,
      phone: phoneNumber,
      clientUri: `${window.location.origin}/confirm-email`, // ✅ Frontend confirmation page
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL; // Ensure your env variable is set
      const response = await fetch(`${apiUrl}/Auth/register/publisher`, {
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
        setSuccessMessage(data.message);
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
        <h2>Register as Publisher</h2>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
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
            <small className="password-policy">
              🔒 Your password must contain:
              <ul>
                <li>At least **8 characters**</li>
                <li>At least **one uppercase letter (A-Z)**</li>
                <li>At least **one lowercase letter (a-z)**</li>
                <li>At least **one number (0-9)**</li>
                <li>At least **one special character (!@#$%^&*)**</li>
              </ul>
            </small>
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
          <div className="phone-input-container">
            <PhoneInput
              placeholder="Enter phone number"
              value={phoneNumber}
              // onChange={setPhoneNumber}
              onChange={(value) => setPhoneNumber(value || '')}
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPublisher;
