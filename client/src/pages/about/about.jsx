import React from "react";
import { useState, useEffect, useRef } from 'react';
import { Helmet } from "react-helmet";
import Footer from "../../components/landing/footer/footer";
import Navbar from "../../components/navbar/navbar";

function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  return (
    <>
      <Navbar />
      <Helmet>
        <title>About Echoes of History AI | Learn from Historical Figures</title>
        <meta name="description" content="Discover how Echoes of History AI brings history to life through AI-powered conversations with Einstein, Tesla, Da Vinci and more." />
        <link rel="canonical" href="https://echoesofhistoryai.org/about" />
        
        {/* Open Graph */}
        <meta property="og:title" content="About Echoes of History AI" />
        <meta property="og:description" content="Learn about our mission to make history accessible through AI conversations." />
        <meta property="og:url" content="https://echoesofhistoryai.org/about" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="About Echoes of History AI" />
        <meta name="twitter:description" content="Learn about our mission to make history accessible through AI conversations." />
      </Helmet>

      <div className="relative min-h-screen bg-black overflow-hidden">
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
        <div className={`relative transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-16 sm:pt-20">
              <div 
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur"
                style={{ animation: 'fadeInUp 0.6s ease-out both' }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse" />
                About
              </div>

              <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7" style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}>
                  <h1 
                    className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl text-white"
                    style={{
                      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >
                    Echoes of History
                    <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                      where learning feels like a conversation.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-gray-300">
                    I built Echoes of History because I wanted history to feel less like memorizing and more like meeting
                    people. Instead of scrolling through summaries, you can ask questions, challenge ideas, and explore
                    context—one conversation at a time.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="/"
                      className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-purple-500/50 hover:scale-105 overflow-hidden"
                      style={{ backgroundSize: '200% auto' }}
                    >
                      <span className="relative z-10">Explore the site</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </a>
                    <a
                      href="/login"
                      className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl shadow-sm transition hover:bg-white/10 hover:border-white/40"
                    >
                      Browse historical figures
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5" style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Vehn%C3%A4pelto_6.jpg"
                      alt="Wheat field"
                      className="h-56 w-full rounded-xl object-cover sm:h-64"
                      loading="lazy"
                    />
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="group rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-3 transition-all duration-300 hover:bg-white/5 hover:border-purple-500/30">
                        <p className="text-xs font-medium text-gray-500">Focus</p>
                        <p className="mt-1 text-sm font-semibold text-white">History through dialogue</p>
                      </div>
                      <div className="group rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-3 transition-all duration-300 hover:bg-white/5 hover:border-pink-500/30">
                        <p className="text-xs font-medium text-gray-500">Goal</p>
                        <p className="mt-1 text-sm font-semibold text-white">Curiosity over cramming</p>
                      </div>
                      <div className="group rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-3 transition-all duration-300 hover:bg-white/5 hover:border-blue-500/30">
                        <p className="text-xs font-medium text-gray-500">Style</p>
                        <p className="mt-1 text-sm font-semibold text-white">Fast, clean, modern</p>
                      </div>
                      <div className="group rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-3 transition-all duration-300 hover:bg-white/5 hover:border-cyan-500/30">
                        <p className="text-xs font-medium text-gray-500">Built by</p>
                        <p className="mt-1 text-sm font-semibold text-white">A student creator</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content Cards */}
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <div 
              className="grid gap-6 lg:grid-cols-3"
              style={{ animation: 'fadeInUp 1.2s ease-out 0.6s both' }}
            >
              <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 hover:border-purple-500/30 hover:scale-105">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight text-white">Why it exists</h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">
                  A lot of "studying" is passive. Echoes of History is built around active learning: asking, following up,
                  disagreeing, and connecting events to bigger themes.
                </p>
              </div>

              <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 hover:border-pink-500/30 hover:scale-105">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight text-white">How it works</h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">
                  Each figure is designed to respond in a clear, engaging voice. The best conversations feel like a guided
                  discussion—quick to start, hard to stop.
                </p>
              </div>

              <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 hover:border-blue-500/30 hover:scale-105">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight text-white">Where it's going</h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">
                  I'm focused on making the experience smoother, more accurate, and more fun—better character discovery,
                  better continuity, and more ways to learn beyond a single chat.
                </p>
              </div>
            </div>

            {/* Quote / signature */}
            <div 
              className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl p-8 shadow-xl"
              style={{ animation: 'fadeInUp 1.4s ease-out 0.8s both' }}
            >
              <div className="relative">
                <svg className="absolute -top-2 -left-2 w-8 h-8 text-purple-500/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-pretty text-base leading-relaxed text-gray-200 italic pl-6">
                  "History sticks when it feels human. If Echoes of History makes you ask one extra question, it's doing its job."
                </p>
                <div className="mt-4 flex items-center gap-3 pl-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
                  <p className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    — Wheatstore
                  </p>
                </div>
              </div>
            </div>
          </section>

          <Footer />
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
    </>
  );
}

export default About;