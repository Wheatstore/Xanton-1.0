import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate()
  
  // Fade-in effect on load
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Gradient text style without animation
  const gradientTextStyle = {
    background: 'linear-gradient(90deg, #ff29f1, #1149ff)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  };

  // Simulated navigation function
  const handleNavigation = (page) => {
    navigate(`/${page}`)
  };

  return (
    <div className="relative w-full min-h bg-black overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      {/* Content container */}
      <div 
        className={`relative w-full h-full flex flex-col justify-center items-center px-6 py-20 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Main heading with gradient highlight */}
        <h1 className="w-full max-w-10xl font-bold font-sans text-white leading-tight tracking-tight text-center mb-6" style={{fontSize: '75px'}}>
          Ready to talk to{" "}
          <span style={gradientTextStyle}>
            History
          </span>
        </h1>
        
        {/* Names showcase */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 text-gray-400 text-lg sm:text-xl">
          <span className="opacity-80 hover:opacity-100 transition-opacity">Gandhi</span>
          <span className="opacity-80 hover:opacity-100 transition-opacity">Einstein</span>
          <span className="opacity-80 hover:opacity-100 transition-opacity">Newton</span>
          <span className="opacity-80 hover:opacity-100 transition-opacity">Galileo</span>
        </div>
        
        {/* Subheading */}
        <h3 className="w-full max-w-md px-4 sm:px-0 font-medium font-sans text-gray-400 text-xl tracking-tight leading-relaxed text-center mb-12">
          Join Xanton to learn the past from those who built it.
        </h3>
        
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center px-8">
          <button 
            onClick={() => handleNavigation("signup")} 
            className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold font-sans text-base text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            Get Started
          </button>
          <button 
            className="flex-1 px-8 py-4 bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-xl text-white font-medium font-sans text-base text-center transition-all duration-300 hover:bg-gray-700 hover:scale-105"
          >
            Learn More
          </button>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 text-gray-500 text-sm">
          Trusted by thousands of history enthusiasts worldwide
        </div>
      </div>
    </div>
  );
};

export default HeroSection;