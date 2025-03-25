import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4 className="footer-title">SciHub</h4>
          <p className="footer-text">Empowering minds through science and knowledge.</p>
        </div>
            <div className="footer-section">
            <h4 className="footer-title">Contact</h4>
            <p className="footer-text">Email: support@scihub.com</p>

            </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SciHub. All rights reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;
