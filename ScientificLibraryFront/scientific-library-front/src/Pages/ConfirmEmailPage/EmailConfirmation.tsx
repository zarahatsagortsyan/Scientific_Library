import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmailConfirmation.css";

const EmailConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const navigate = useNavigate();
  const hasConfirmed = useRef(false); // ✅ Prevent multiple calls

  useEffect(() => {
    const confirmEmail = async () => {
      if (hasConfirmed.current) return; // ✅ Prevent second call
      hasConfirmed.current = true; // ✅ Mark as executed

      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setStatus("error");
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/Auth/confirm-email`,
          { email, token }
        );

        console.log("API Response:", response);
        if (response.status === 200) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error confirming email:", error);
        setStatus("error");
      }
    };

    confirmEmail();
  }, [searchParams]); // ✅ `useEffect` runs once due to ref tracking

  return (
    <div className="email-confirmation-container">
      <div className="email-confirmation-box">
        {status === "loading" && (
          <>
            <h2>Confirming your email...</h2>
            <p>Please wait while we verify your email address.</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="confirmation-icon">✅</div>
            <h2>Email Confirmed!</h2>
            <p>
              Your email has been successfully verified. You can now log in.
            </p>
            <button
              className="confirmation-button"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <div className="error-icon">❌</div>
            <h2>Confirmation Failed</h2>
            <p>Invalid or expired confirmation link.</p>
            <button
              className="confirmation-button error-button"
              onClick={() => navigate("/")}
            >
              Go to Homepage
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmation;
