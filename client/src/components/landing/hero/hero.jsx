import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredName, setHoveredName] = useState(null);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
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
    const particleCount = 60;

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

  const historicalFigures = [
    { name: 'Gandhi', color: 'from-amber-400 to-orange-500' },
    { name: 'Einstein', color: 'from-blue-400 to-cyan-500' },
    { name: 'Newton', color: 'from-purple-400 to-pink-500' },
    { name: 'Galileo', color: 'from-emerald-400 to-teal-500' },
  ];

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
          ✦ Time Travel Awaits ✦
        </div>


        {/* Main heading with animated gradient */}
        <h1
          className="w-full max-w-5xl font-black text-white leading-[0.95] tracking-tight text-center mb-8 transition-all duration-700"
          style={{
            fontSize: 'clamp(48px, 8vw, 85px)',
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            textShadow: '0 0 80px rgba(147, 51, 234, 0.3)',
          }}
        >
          Ready to talk to{' '}
          <span
            className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-gradient-x relative"
            style={{
              backgroundSize: '200% auto',
              animation: 'gradient 3s ease infinite',
            }}
          >
            History
            <span className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 blur-2xl opacity-30 -z-10" />
          </span>
        </h1>

        {/* Interactive names showcase with hover effects */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 px-4">
          {historicalFigures.map((figure, index) => (
            <button
              key={figure.name}
              onMouseEnter={() => setHoveredName(figure.name)}
              onMouseLeave={() => setHoveredName(null)}
              className="group relative px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-white/30"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <span
                className={`relative z-10 text-lg font-semibold transition-all duration-300 ${
                  hoveredName === figure.name
                    ? 'text-transparent bg-clip-text bg-gradient-to-r ' + figure.color
                    : 'text-gray-300 group-hover:text-white'
                }`}
              >
                {figure.name}
              </span>
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${figure.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
              />
            </button>
          ))}
        </div>

        {/* Subheading with stagger animation */}
        <h3
          className="w-full max-w-2xl px-4 sm:px-0 font-normal text-gray-400 text-xl sm:text-2xl leading-relaxed text-center mb-14"
          style={{
            animation: 'fadeInUp 0.8s ease-out 0.3s both',
            fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Join <span className="text-white font-semibold">Echoes of History</span> to learn
          the past from those who built it.
        </h3>

        {/* CTA buttons with enhanced effects */}
        <div
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center px-8 mb-20"
          style={{ animation: 'fadeInUp 1s ease-out 0.5s both' }}
        >
          <button
            onClick={() => handleNavigation('signup')}
            className="group relative flex-1 px-8 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl text-white font-bold text-base text-center shadow-2xl transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105 overflow-hidden"
            style={{ backgroundSize: '200% auto' }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Get Started
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
          <button
            onClick={() => handleNavigation('features')}
            className="group flex-1 px-8 py-5 bg-white/5 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white font-semibold text-base text-center transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:scale-105"
          >
            <span className="flex items-center justify-center gap-2">
              Learn More
              <span className="inline-block transition-transform duration-300 group-hover:rotate-90">
                ↗
              </span>
            </span>
          </button>
        </div>

        {/* Enhanced trust indicators */}
        <div className="flex flex-col items-center gap-4" style={{ animation: 'fadeInUp 1.2s ease-out 0.7s both' }}>
          <div className="flex items-center gap-6 text-gray-500 text-sm">
            <span className="font-medium">
              Trusted by{' '}
              <span className="text-white font-bold">10,000+</span> history
              enthusiasts
            </span>
          </div>
          <div className="flex gap-6 text-gray-600 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-purple-500">★★★★★</span>
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-500">✓</span>
              <span>Verified Platform</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce"
          style={{ animation: 'fadeInUp 1.5s ease-out 1s both, bounce 2s ease-in-out 2s infinite' }}
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <style jsx>{`
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

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          50% {
            transform: translateY(-10px) translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;