import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function Submitted() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [checkmarkVisible, setCheckmarkVisible] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Fade-in effect on load
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setCheckmarkVisible(true), 600);
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
          ✦ Submission Received ✦
        </div>

        {/* Animated checkmark circle */}
        <div 
          className={`relative mb-8 transition-all duration-700 ${
            checkmarkVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          style={{ animation: checkmarkVisible ? 'scaleIn 0.6s ease-out' : 'none' }}
        >
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-30 blur-xl animate-pulse" />
            
            {/* Main circle */}
            <div className="relative w-24 h-24 rounded-full border-4 border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center">
              {/* Checkmark */}
              <svg 
                className="w-12 h-12 text-white"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ animation: checkmarkVisible ? 'drawCheck 0.5s ease-out 0.3s both' : 'none' }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                  style={{
                    strokeDasharray: 24,
                    strokeDashoffset: checkmarkVisible ? 0 : 24,
                    transition: 'stroke-dashoffset 0.5s ease-out 0.3s',
                  }}
                />
              </svg>
              
              {/* Inner gradient glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
            </div>

            {/* Success particles */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    animation: checkmarkVisible ? `particle ${0.8}s ease-out ${0.5 + i * 0.05}s both` : 'none',
                    '--angle': `${i * 45}deg`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main heading */}
        <h1
          className="w-full max-w-3xl font-bold text-white text-center mb-4 px-4"
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            animation: 'fadeInUp 0.8s ease-out 0.2s both',
            textShadow: '0 0 40px rgba(147, 51, 234, 0.3)',
          }}
        >
          Thank you for{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            submitting
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="w-full max-w-2xl px-4 text-gray-300 text-lg sm:text-xl leading-relaxed text-center mb-12"
          style={{
            animation: 'fadeInUp 1s ease-out 0.4s both',
            fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Your submission is now under review and will be added in{' '}
          <span className="text-white font-semibold">1-3 days</span> if eligible
        </p>

        {/* Info card */}
        <div
          className="w-full max-w-md mb-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl"
          style={{ animation: 'fadeInUp 1.2s ease-out 0.6s both' }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">What happens next?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our team will review your submission for accuracy and relevance. You'll receive an email notification once your submission is approved and published.
              </p>
            </div>
          </div>
        </div>

        {/* CTA button */}
        <div
          className="w-full max-w-md px-8"
          style={{ animation: 'fadeInUp 1.4s ease-out 0.8s both' }}
        >
          <button
            onClick={() => navigate("/user")}
            className="group relative w-full px-8 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl text-white font-bold text-base text-center shadow-2xl transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105 overflow-hidden"
            style={{ backgroundSize: '200% auto' }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Return Home
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>

        {/* Timeline indicator */}
        <div
          className="mt-16 w-full max-w-2xl"
          style={{ animation: 'fadeInUp 1.8s ease-out 1.2s both' }}
        >
          <div className="flex items-center justify-between gap-4 px-4">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-2 shadow-lg">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white text-xs font-medium">Submitted</span>
            </div>

            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-pink-500/50" />

            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border-2 border-pink-500/30 bg-pink-500/10 flex items-center justify-center mb-2">
                <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              </div>
              <span className="text-gray-400 text-xs font-medium">Review</span>
            </div>

            <div className="flex-1 h-px bg-gradient-to-r from-pink-500/50 to-blue-500/30" />

            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 bg-blue-500/5 flex items-center justify-center mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-400/50" />
              </div>
              <span className="text-gray-500 text-xs font-medium">Published</span>
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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes drawCheck {
          from {
            stroke-dashoffset: 24;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes particle {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(40px);
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

export default Submitted;