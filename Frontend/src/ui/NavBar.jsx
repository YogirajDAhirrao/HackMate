import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

import ProfileSection from "./ProfileSection";
import { useAuth } from "../context/AuthContext";
//import Logo from "./Logo"; // Assuming you have a Logo component

const NavBar = () => {
  const { user } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">{/* <Logo /> */}</div>
        <ul className="nav-links">
          <li>
            <Link to="/hackathons">Hackathons</Link>
          </li>
          <li>
            <Link to="/find-partners">Find Partners</Link>
          </li>
          <li>
            <Link to="/teams">Teams</Link>
          </li>
        </ul>
        <div className="nav-actions">
          <button className="search-btn">🔍</button>
          {user ? (
            <ProfileSection />
          ) : (
            <>
              <Link to="/login" className="btn btn-purple">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-dark">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
