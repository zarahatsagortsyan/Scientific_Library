import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword === "" || confirmNewPassword === "") {
      setError("Both password fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const email = queryParams.get("email");

    if (!token || !email) {
      setError("Invalid reset link.");
      return;
    }

    try {
      const payload = {
        newPassword,
        confirmNewPassword,
        email,
        token,
      };

      const response = await fetch(`${apiUrl}/Auth/resetpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data.succeeded) {
        setError("");
        setSuccessMessage("Password reset was successful! You may now log in.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const errorDescriptions =
          data.data.errors?.map((err: any) => err.description).join("\n ") ||
          "Password reset failed.";
        setError(errorDescriptions);
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleResetPassword}>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
