// src/components/Navbar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation(); // Mevcut URL'yi al

  return (
    <div className="navbar">
      <Link to="/" className={`nav-btn ${location.pathname === "/" ? "active" : ""}`}>
        Home
      </Link>
      <Link to="/members" className={`nav-btn ${location.pathname === "/members" ? "active" : ""}`}>
        Members
      </Link>
      <Link to="/activity" className={`nav-btn ${location.pathname === "/activity" ? "active" : ""}`}>
        Activity
      </Link>
      <Link to="/tasks" className={`nav-btn ${location.pathname === "/tasks" ? "active" : ""}`}>
        Tasks
      </Link>
      <Link to="/merge-request" className={`nav-btn ${location.pathname === "/merge-request" ? "active" : ""}`}>
        Pull Requests
      </Link>
      <Link to="/todo" className={`nav-btn ${location.pathname === "/todo" ? "active" : ""}`}>
        To-Do List
      </Link>
      <Link to="/monitoring" className={`nav-btn ${location.pathname === "/monitoring" ? "active" : ""}`}>
        Monitoring
      </Link>
      <Link to="/cicd" className={`nav-btn ${location.pathname === "/cicd" ? "active" : ""}`}>
        CI/CD
      </Link>
    </div>
  );
};

export default Navbar;
