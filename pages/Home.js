// src/pages/Home.js
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  useEffect(() => {
    // Add a class to the body to trigger the animation
    document.body.classList.add("page-loaded");
    return () => {
      document.body.classList.remove("page-loaded");
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className="home-page">
        <div className="background-logos">
          {/* Multiple logos in the background */}
          {[...Array(50)].map((_, index) => (
            <img
              key={index}
              src={process.env.PUBLIC_URL + "/logo.webp"}
              alt="Background Logo"
              className="background-logo"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        <div className="container">
          <h1 className="animated-text">DevOps Project</h1>
          <p className="animated-text">
          You can access other pages by clicking on the buttons in the menu.            
          </p>
          <img
            src={process.env.PUBLIC_URL + "/logo.webp"}
            alt="Logo"
            className="main-logo"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
