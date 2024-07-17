import React from 'react';
import './hero.css'; // Import the hero CSS
import { useLocation, useNavigate } from 'react-router-dom';

function HeroSection() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div className="hero-section-container">
        <div className="grid-background"></div>
        <div className="grid-overlay"></div>
        {location.pathname === "/user" ? <h1 className="welcome-heading-hero-section">Welcome! 😊</h1> : <h1 className="welcome-heading-hero-section">Welcome to Xanton</h1>}
        <h1 className="hero-heading">
          <span className="heading--highlight">Interact with people </span>from the past for free.
        </h1>
        <div className="hero-description-container">
          <h3>Step into the past and converse with the most influential figures in human history. With just your typing, unlock the wisdom, insights, and stories of legendary leaders, thinkers, and pioneers.</h3>
        </div>
        {location.pathname === "/" && <div className="join-now-button-container">
          <button onClick={() => navigate("/signup")} className="join-now-hero-section-button">Get Started</button>
        </div>}
      </div>
      {/* {location.pathname === "/" && 
      <div className="website-mockup-container">
        <img src="/images/mockup-hero.png" alt="" />
      </div> } */}
    </>
  );
}

export default HeroSection;
