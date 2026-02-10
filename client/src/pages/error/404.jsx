import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound404 = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timeElapsed, setTimeElapsed] = useState(0);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Fade-in effect on load
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Time counter for "lost in time" effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
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
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.6 + 0.2,
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

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.2 * (1 - distance / 100)})`;
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

  const handleNavigation = (page) => {
    navigate(`/${page}`);
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

      {/* Content container */}
      <div
        className={`relative w-full min-h-screen flex flex-col justify-center items-center px-6 py-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Decorative top element */}
        <div className="mb-8 text-purple-300 text-sm uppercase tracking-[0.3em] font-semibold animate-softPulse">
          ✦ Timeline Disruption ✦
        </div>

        {/* Animated 404 with glitch effect */}
        <div
          className="relative mb-6"
          style={{ animation: 'fadeInUp 0.6s ease-out both' }}
        >
          <h1
            className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 leading-none tracking-tighter relative"
            style={{
              fontSize: 'clamp(120px, 20vw, 240px)',
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              backgroundSize: '200% auto',
              animation: 'gradient 3s ease infinite',
            }}
          >
            404
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-3xl opacity-40 -z-10" />
          </h1>
          {/* Glitch layers */}
          <h1
            className="absolute top-0 left-0 font-black text-purple-500 opacity-20 leading-none tracking-tighter"
            style={{
              fontSize: 'clamp(120px, 20vw, 240px)',
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              transform: 'translate(-2px, -2px)',
              animation: 'glitch1 2s infinite',
            }}
          >
            404
          </h1>
          <h1
            className="absolute top-0 left-0 font-black text-blue-500 opacity-20 leading-none tracking-tighter"
            style={{
              fontSize: 'clamp(120px, 20vw, 240px)',
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              transform: 'translate(2px, 2px)',
              animation: 'glitch2 2s infinite',
            }}
          >
            404
          </h1>
        </div>

        {/* Main heading */}
        <h2
          className="w-full max-w-3xl font-bold text-white text-center mb-4 px-4"
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            animation: 'fadeInUp 0.8s ease-out 0.2s both',
          }}
        >
          Lost in the{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Time-Space Continuum
          </span>
        </h2>

        {/* Subheading */}
        <p
          className="w-full max-w-2xl px-4 text-gray-400 text-lg sm:text-xl leading-relaxed text-center mb-8"
          style={{
            animation: 'fadeInUp 1s ease-out 0.4s both',
            fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          This page seems to have been lost to history. Perhaps it never existed, or maybe it's waiting to be discovered in a different timeline.
        </p>

        {/* Time counter */}
        <div
          className="mb-12 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
          style={{ animation: 'fadeInUp 1.2s ease-out 0.6s both' }}
        >
          <p className="text-gray-500 text-sm">
            Time lost:{' '}
            <span className="text-purple-400 font-mono font-semibold">
              {timeElapsed}s
            </span>
          </p>
        </div>

        {/* Suggested links as historical figures */}
        <div
          className="flex flex-wrap justify-center gap-4 mb-12 px-4"
          style={{ animation: 'fadeInUp 1.4s ease-out 0.8s both' }}
        >
          <button
            onClick={() => handleNavigation('')}
            className="group relative px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-white/30"
          >
            <span className="relative z-10 text-base font-semibold text-gray-300 group-hover:text-white transition-all duration-300">
              Return Home
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
          </button>
          
          <button
            onClick={() => handleNavigation('features')}
            className="group relative px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-white/30"
          >
            <span className="relative z-10 text-base font-semibold text-gray-300 group-hover:text-white transition-all duration-300">
              Explore Features
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="group relative px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-white/30"
          >
            <span className="relative z-10 text-base font-semibold text-gray-300 group-hover:text-white transition-all duration-300">
              Go Back
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
          </button>
        </div>

        {/* CTA button */}
        <div
          className="w-full max-w-md px-8"
          style={{ animation: 'fadeInUp 1.6s ease-out 1s both' }}
        >
          <button
            onClick={() => handleNavigation('')}
            className="group relative w-full px-8 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl text-white font-bold text-base text-center shadow-2xl transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105 overflow-hidden"
            style={{ backgroundSize: '200% auto' }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Back to Echoes of History
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>

        {/* Historical quote */}
        <div
          className="mt-16 max-w-2xl px-6 text-center"
          style={{ animation: 'fadeInUp 1.8s ease-out 1.2s both' }}
        >
          <p className="text-gray-600 italic text-sm mb-2">
            "Not all those who wander are lost."
          </p>
          <p className="text-gray-700 text-xs">
            — J.R.R. Tolkien
          </p>
        </div>

        {/* Floating error code */}
        <div
          className="absolute bottom-8 right-8 px-4 py-2 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg"
          style={{ animation: 'fadeInUp 2s ease-out 1.4s both' }}
        >
          <p className="font-mono text-purple-400 text-xs">
            ERR_PAGE_NOT_FOUND
          </p>
        </div>
      </div>

      <style jsx='true'>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

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

        @keyframes glitch1 {
          0%, 90%, 100% {
            transform: translate(-2px, -2px);
          }
          20%, 40%, 60%, 80% {
            transform: translate(-4px, 2px);
          }
        }

        @keyframes glitch2 {
          0%, 90%, 100% {
            transform: translate(2px, 2px);
          }
          20%, 40%, 60%, 80% {
            transform: translate(4px, -2px);
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
};

export default NotFound404;