import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const isLoggedIn = localStorage.getItem("jwtToken"); // Check if user is logged in
  // console.log(localStorage.getItem("jwtToken"));
  const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // Toggle the dropdown visibility
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken"); // Remove the JWT token from localStorage
    window.location.reload(); // Reload the page after logging out
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            className="navbar-logo rounded-circle w-25"
            src="/logo.jpg"
            alt="SciHub Logo"
          />
        </Link>
        <div className="collapse navbar-collapse">
          {/* Right-aligned links */}
          <ul className="navbar-nav ml-auto">
            {/* Show Login and Register links if user is not logged in */}
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register/reader">
                    Register as Reader
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register/publisher">
                    Register as Publisher
                  </Link>
                </li>
              </>
            )}
            {/* Show User Icon and Dropdown if logged in */}
            {isLoggedIn && (
              <li className="nav-item" style={{ position: "relative" }}>
                {/* Right-aligned user icon */}
                <img
                  src="/user-icon.png" // Image in public folder
                  alt="User Icon"
                  className="user-icon"
                  style={{
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                    marginRight: "10px", // Add margin for spacing
                    position: "absolute",
                    right: "10px", // Right-align the image in the navbar
                  }}
                  onClick={toggleDropdown} // Toggle dropdown visibility on click
                />
                {showDropdown && (
                  <div
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      top: "35px", // Adjust based on your header's height
                      right: "0", // Right align the dropdown
                    }}
                  >
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                    <a
                      className="dropdown-item"
                      href="#!"
                      onClick={handleLogout} // Logout function
                    >
                      Logout
                    </a>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
