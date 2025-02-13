import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const isLoggedIn = localStorage.getItem("jwtToken");
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    window.location.reload();
  };

  return (
    <nav className="custom-navbar">
      <div className="nav-container">
        <Link className="navbar-brand" to="/">
          <img className="navbar-logo" src="/logo.jpg" alt="SciHub Logo" />
          <span className="logo-text">Scientific Library</span>
        </Link>

        <ul className="nav-links">
          {!isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  🔑 Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register/reader">
                  🧑‍🏫 Register Reader
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register/publisher">
                  📖 Register Publisher
                </Link>
              </li>
            </>
          ) : (
            <li className="nav-item user-menu">
              <img
                src="/user-icon.png"
                alt="User"
                className="user-icon"
                onClick={toggleDropdown}
              />
              {showDropdown && (
                <div className="dropdown-menu show">
                  <Link className="dropdown-item" to="/profile">
                    👤 Profile
                  </Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
