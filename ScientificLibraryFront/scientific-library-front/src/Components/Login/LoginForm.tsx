import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setError("Both fields are required.");
      return;
    }

    setError("");
    setSuccessMessage("");

    const payload = {
      userName: email,
      Email: email,
      password: password,
    };

    try {
      const response = await fetch(`${apiUrl}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      if (data.isLogedIn) {
        setSuccessMessage("Login successful!");
        localStorage.setItem("jwtToken", data.jwtToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        navigate("/");
        window.location.reload();
      } else {
        setError("Invalid login credentials.");
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email before requesting a password reset.");
      return;
    }

    setError("");
    setSuccessMessage("");

    const payload = {
      clientUri: `${window.location.origin}/reset-password`,
      email: email,
    };

    try {
      const response = await fetch(`${apiUrl}/Auth/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send password reset email.");
      }

      setSuccessMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>
        <div className="links">
          <button
            onClick={handleForgotPassword}
            className="forgot-password-btn"
          >
            Forgot Password?
          </button>
          <br />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
