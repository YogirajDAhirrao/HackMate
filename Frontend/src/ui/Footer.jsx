import React from "react";
import "./Footer.css"; // or use inline styles/CSS modules if preferred

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} HackMate. All rights reserved.</p>
        
      </div>
    </footer>
  );
}

export default Footer;
