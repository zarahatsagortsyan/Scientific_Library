// import React, { useState } from "react";
// import "./Register.css";
// import "react-phone-number-input/style.css";
// import PhoneInput from "react-phone-number-input";

// const RegisterReader: React.FC = () => {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [dateOfBirth, setDateOfBirth] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Check if all required fields are filled
//     if (!firstName || !email || !password || !dateOfBirth || !phoneNumber) {
//       setError("All fields are required.");
//       return;
//     }

//     setError("");
//     setSuccessMessage("");

//     // Prepare the payload
//     const payload = {
//       email,
//       password,
//       firstName,
//       lastName,
//       birthDate: new Date(dateOfBirth).toISOString(),
//       phone: phoneNumber,
//       clientUri: `${window.location.origin}/confirm-email`,
//     };

//     try {
//       const apiUrl = import.meta.env.VITE_API_URL;
//       const response = await fetch(`${apiUrl}/Auth/register/reader`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (response.ok && data.success && data.data?.succeeded) {
//         setError("");
//         setSuccessMessage(data.message);
//         // setTimeout(() => navigate("/login"), 3000);
//       } else {
//         // Extract and show only the first error message
//         let firstErrorMessage = "Registration failed.";

//         if (data.errors) {
//           const firstErrorKey = Object.keys(data.errors)[0]; // Get the first error field
//           firstErrorMessage =
//             data.errors[firstErrorKey]?.[0] || firstErrorMessage;
//         } else if (data.data?.errors?.length > 0) {
//           firstErrorMessage = data.data.errors[0].description;
//         } else if (data.message) {
//           firstErrorMessage = data.message;
//         }

//         setError(firstErrorMessage);
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again later.");
//     }
//   };

//   return (
//     <div className="registration-form-container">
//       <div className="registration-form">
//         <h2>Register as Reader</h2>
//         {error && <p className="error">{error}</p>}
//         {successMessage && <p className="success">{successMessage}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="firstName">First Name</label>
//             <input
//               type="text"
//               id="firstName"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//               placeholder="Enter your first name"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="lastName">Last Name</label>
//             <input
//               type="text"
//               id="lastName"
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//               placeholder="Enter your last name"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="email">Email & Username</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//             />
//             <small className="password-policy">
//               🔒 Your password must contain:
//               <ul>
//                 <li>At least **8 characters**</li>
//                 <li>At least **one uppercase letter (A-Z)**</li>
//                 <li>At least **one lowercase letter (a-z)**</li>
//                 <li>At least **one number (0-9)**</li>
//                 <li>At least **one special character (!@#$%^&*)**</li>
//               </ul>
//             </small>
//           </div>
//           <div className="form-group">
//             <label htmlFor="dob">Date of Birth</label>
//             <input
//               type="date"
//               id="dob"
//               value={dateOfBirth}
//               onChange={(e) => setDateOfBirth(e.target.value)}
//             />
//           </div>
//           <div className="phone-input-container">
//             <PhoneInput
//               placeholder="Enter phone number"
//               value={phoneNumber}
//               // onChange={setPhoneNumber}
//               onChange={(value) => setPhoneNumber(value || "")}
//             />
//           </div>
//           <button type="submit">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterReader;
import React, { useState } from "react";
import "./Register.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const RegisterReader: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !email || !password || !dateOfBirth || !phoneNumber) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setSuccessMessage("");

    const payload = {
      email,
      password,
      firstName,
      lastName,
      birthDate: new Date(dateOfBirth).toISOString(),
      phone: phoneNumber,
      clientUri: `${window.location.origin}/confirm-email`,
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/Auth/register/reader`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data?.succeeded) {
        setError("");
        setSuccessMessage(data.message);
      } else {
        let firstErrorMessage = "Registration failed.";

        if (data.errors) {
          const firstErrorKey = Object.keys(data.errors)[0];
          firstErrorMessage =
            data.errors[firstErrorKey]?.[0] || firstErrorMessage;
        } else if (data.data?.errors?.length > 0) {
          firstErrorMessage = data.data.errors[0].description;
        } else if (data.message) {
          firstErrorMessage = data.message;
        }

        setError(firstErrorMessage);

        // If email is already registered but not confirmed, show resend confirmation link
        if (
          firstErrorMessage.includes("already registered but not confirmed")
        ) {
          setUnconfirmedEmail(email);
          setTimeout(() => setShowResend(true), 3000);
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  const handleResendConfirmation = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/Auth/resend-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: unconfirmedEmail,
          clientUri: `${window.location.origin}/confirm-email`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("A new confirmation email has been sent.");
        setShowResend(false);
      } else {
        setError(data.message || "Failed to resend confirmation email.");
      }
    } catch (error) {
      setError("An error occurred while resending the confirmation email.");
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
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email & Username</label>
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
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          <div className="phoneColor">
            <PhoneInput
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(value) => setPhoneNumber(value || "")}
            />
          </div>
          <button type="submit">Register</button>
        </form>

        {showResend && (
          <div className="mt-4">
            <button
              onClick={handleResendConfirmation}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Resend Confirmation Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterReader;
