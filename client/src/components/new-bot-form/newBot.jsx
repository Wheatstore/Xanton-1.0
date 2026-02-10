import React from 'react';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

// Get server URL from environment variable
// process.env.REACT_APP_SERVER_URL ||
const SERVER_URL = "https://historia-backend-ycj7.onrender.com";

function NewBot() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    greeting: "",
    description: "",
    additionalMessage: ""
  });
  
  const [filledOut, setFilled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fade-in effect on load
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animated particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`;
        ctx.fill();
      });

      // Connect particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.greeting || !formData.description) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${SERVER_URL}/api/create-new-bot`, {
        name: formData.name,
        creator: user.displayName,
        creatorId: user.uid,
        greeting: formData.greeting,
        description: formData.description,
        additionalMessage: formData.additionalMessage
      });
      
      setFilled(true);
      setLoading(false);
      
      if (response.status === 200) {
        navigate("/submitted");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Guidelines for creating a bot
  const guidelines = [
    {
      title: "Choose a Well-Known Figure",
      description: "Select historical figures that are widely recognized and have substantial documented information available.",
      icon: "👤",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Craft an Authentic Greeting",
      description: "Write a greeting that captures the figure's personality, speaking style, and era.",
      icon: "💬",
      gradient: "from-pink-500 to-blue-500"
    },
    {
      title: "Be Detailed in Description",
      description: "Include key achievements, time period, areas of expertise, and unique characteristics.",
      icon: "📝",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Add Context",
      description: "Consider including historical context, contemporaries, and significant events from their lifetime.",
      icon: "🌍",
      gradient: "from-cyan-500 to-emerald-500"
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Animated particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-40"
      />

      {/* Dynamic background gradients with parallax */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        />
        <div
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-600 rounded-full opacity-20 blur-3xl transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600 rounded-full opacity-10 blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(calc(-50% + ${mousePosition.x * 0.5}px), calc(-50% + ${mousePosition.y * 0.5}px))`,
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className={`relative w-full min-h-screen pt-20 pb-16 px-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div 
            className="mb-10 text-center"
            style={{ animation: 'fadeInUp 0.6s ease-out both' }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse" />
              Bot Creation
            </div>
            <h1 
              className="text-4xl sm:text-5xl font-bold text-white mb-3"
              style={{
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Create a New{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Historical Bot
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Bring history to life with an AI-powered historical figure</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Section */}
            <div 
              className="lg:w-2/3"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
            >
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">Bot Details</h2>
                      <p className="text-gray-300 text-sm">All fields marked with <span className="text-purple-400">*</span> are required</p>
                    </div>
                  </div>
                </div>
                
                <form className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Historical Figure Name <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="E.g., Albert Einstein, Marie Curie"
                      className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-black/60"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="greeting" className="block text-sm font-medium text-gray-300">
                      Greeting Message <span className="text-purple-400">*</span>
                    </label>
                    <textarea
                      id="greeting"
                      name="greeting"
                      value={formData.greeting}
                      onChange={handleChange}
                      rows="3"
                      placeholder="How your bot will greet users (in the figure's authentic voice)"
                      className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-black/60 resize-none"
                      required
                    ></textarea>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Write in first person as if the historical figure is speaking
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                      Description <span className="text-purple-400">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe the historical figure's background, achievements, and personality"
                      className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-black/60 resize-none"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="additionalMessage" className="block text-sm font-medium text-gray-300">
                      Additional Information <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      id="additionalMessage"
                      name="additionalMessage"
                      value={formData.additionalMessage}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Any extra details or specific characteristics you want to emphasize"
                      className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:bg-black/60 resize-none"
                    ></textarea>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="group relative w-full px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                      style={{ backgroundSize: '200% auto' }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Creating Bot...
                          </>
                        ) : (
                          <>
                            Create Historical Bot
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Guidelines Section */}
            <div 
              className="lg:w-1/3"
              style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}
            >
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden sticky top-24">
                <div className="p-5 bg-gradient-to-br from-blue-900/40 to-cyan-900/20 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-white">Bot Creation Guidelines</h3>
                  </div>
                </div>
                <div className="p-5">
                  <ul className="space-y-4">
                    {guidelines.map((guideline, index) => (
                      <li key={index} className="group pb-4 border-b border-white/10 last:border-0 last:pb-0">
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${guideline.gradient} flex items-center justify-center text-lg transition-transform duration-300 group-hover:scale-110`}>
                            {guideline.icon}
                          </div>
                          <div>
                            <h4 className="text-white font-medium text-sm mb-1">{guideline.title}</h4>
                            <p className="text-gray-400 text-xs leading-relaxed">{guideline.description}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 p-4 bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/20 rounded-xl">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">💡</span>
                      <div>
                        <p className="text-xs text-gray-300">
                          <span className="font-semibold text-white block mb-1">Pro Tip:</span>
                          Provide specific details and context about your historical figure to create a more accurate and engaging bot experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx='true'>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default NewBot;