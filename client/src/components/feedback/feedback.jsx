import React from 'react';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

const SERVER_URL =
  process.env.REACT_APP_SERVER_URL ||
  "https://historia-backend-ycj7.onrender.com";

function Feedback() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    email: "",
    description: ""
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const sendFeedback = async () => {
    try {
      const body = {
        senderUid: user?.uid || null,
        senderEmail: user?.email || null,
        title: formData.title,
        email: formData.email,
        description: formData.description
      };

      const response = await axios.post(
        `${SERVER_URL}/api/feedback`,
        body
      );

      if (response.status === 200) {
        navigate("/user");
      }
    } catch (error) {
      console.error("There was an error submitting feedback", error);
    }
  };

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
      <div
        className={`relative w-full pt-20 pb-16 max-w-3xl mx-auto px-6 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Decorative top element */}
        <div 
          className="mb-8 text-center text-purple-300 text-sm uppercase tracking-[0.3em] font-semibold animate-softPulse"
          style={{ animation: 'fadeInUp 0.6s ease-out both' }}
        >
          ✦ We Value Your Input ✦
        </div>

        {/* Form container */}
        <div 
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden"
          style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
        >
          {/* Header */}
          <div className="relative p-8 bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-b border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h1 
                  className="text-3xl font-bold text-white"
                  style={{
                    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  Help improve{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Echoes of History AI
                  </span>
                </h1>
              </div>
              <p className="text-gray-300 text-base">
                All feedback is reviewed carefully. Please be honest and specific.
              </p>
            </div>
          </div>

          {/* Form fields */}
          <div className="p-8 space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title <span className="text-purple-400">*</span>
              </label>
              <input
                className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-black/60"
                placeholder="Briefly describe your feedback"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-gray-500 text-xs">(optional, for follow-up)</span>
              </label>
              <input
                className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-black/60"
                placeholder="your.email@example.com"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-purple-400">*</span>
              </label>
              <textarea
                className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-black/60 h-40 resize-none"
                placeholder="Describe the issue or suggestion in detail. The more specific you are, the better we can help."
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="group relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden mt-6"
              style={{ backgroundSize: '200% auto' }}
              onClick={sendFeedback}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Submit Feedback
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-5 bg-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Feedback is reviewed directly by the Echoes of History AI team.</span>
            </div>
          </div>
        </div>

        {/* Quick tips */}
        <div 
          className="mt-8 grid gap-4 sm:grid-cols-3"
          style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}
        >
          <div className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white/10 hover:border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <h3 className="text-white font-semibold text-sm">Be specific</h3>
            </div>
            <p className="text-gray-400 text-xs">
              Include details about what happened and when
            </p>
          </div>

          <div className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white/10 hover:border-pink-500/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <h3 className="text-white font-semibold text-sm">Screenshots help</h3>
            </div>
            <p className="text-gray-400 text-xs">
              Visual examples make issues easier to fix
            </p>
          </div>

          <div className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white/10 hover:border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <h3 className="text-white font-semibold text-sm">One issue per form</h3>
            </div>
            <p className="text-gray-400 text-xs">
              Submit multiple forms for different issues
            </p>
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

        @keyframes softPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-softPulse {
          animation: softPulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Feedback;