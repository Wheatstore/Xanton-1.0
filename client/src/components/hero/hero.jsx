import React from 'react';
import Marquee from 'react-fast-marquee';
import './hero.css'; // Import the hero CSS
import { useLocation, useNavigate } from 'react-router-dom';
import Featured from '../carousel/featured/featured';

function HeroSection() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div className="hero-section-container">
        <h1 className="hero-heading">
          Ready to talk to 
          <h1 className="mobileview"> history</h1>
          <div className="inner-headings-hero">
            <span>
              Gandhi <br />
              Newton <br />
              Einstein <br />
              Galileo <br />
            </span>
          </div>
        </h1>
        <h3>Join Xanton to learn the past from those who built it.</h3>
        <div className="button-section-container-hero">
          <button onClick={() => navigate("/signup")} className="join-now-hero-section-button">Get Started</button>
          <button className='learn-more-button-hero'>Learn more</button>
        </div>
        <Marquee direction="left" autoFill={true} speed={30}>
            <Featured />
        </Marquee>
      </div>
    </>
  );
}

export default HeroSection;
