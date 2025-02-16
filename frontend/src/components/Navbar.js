// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/" className="nav-btn">
        Ana Sayfa
      </Link>
      <Link to="/members" className="nav-btn">
        Members
      </Link>
      <Link to="/activity" className="nav-btn">
        Activity
      </Link>
      <Link to="/tasks" className="nav-btn">
        Tasks
      </Link>
      <Link to="/merge-request" className="nav-btn">
        Merge Requests
      </Link>
      <Link to="/todo" className="nav-btn">
        To-Do List
      </Link>
      <Link to="/monitoring" className="nav-btn">
        Monitoring
      </Link>
      <Link to="/cicd" className="nav-btn">
        CI/CD
      </Link>
    </div>
  );
};

export default Navbar;
