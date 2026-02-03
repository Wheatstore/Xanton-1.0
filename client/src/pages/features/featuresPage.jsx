import React from "react";
import { useState, useEffect, useRef } from 'react';
import { Helmet } from "react-helmet";
import Footer from "../../components/landing/footer/footer";
import Navbar from "../../components/navbar/navbar";

function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  
  const features = [
    {
      title: "Talk to historical figures",
      desc: "Ask real questions and get responses that feel like a guided conversation—not a textbook dump.",
      icon: "💬",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Follow-up like you're in a seminar",
      desc: "Push back, ask why, and keep drilling deeper. The best learning happens in the follow-ups.",
      icon: "🎯",
      gradient: "from-pink-500 to-blue-500",
    },
    {
      title: "Fast character discovery",
      desc: "Browse by era, theme, or topic so you're not stuck searching for the right name.",
      icon: "🔍",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Context-first answers",
      desc: "Get quick background, then zoom in. Useful when you're starting from zero or cramming for clarity.",
      icon: "📚",
      gradient: "from-cyan-500 to-emerald-500",
    },
    {
      title: "Save and continue later",
      desc: "Pick up conversations where you left off instead of restarting every time you return.",
      icon: "💾",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Built for school + curiosity",
      desc: "Great for class topics, projects, and rabbit holes—without feeling like traditional studying.",
      icon: "🎓",
      gradient: "from-teal-500 to-purple-500",
    },
  ];

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
        <title>Features | Echoes of History AI</title>
        <meta
          name="description"
          content="Explore Echoes of History AI features: conversations with historical figures, deep follow-ups, character discovery, and a modern learning experience built for curiosity."
        />
        <meta name="robots" content="index, follow" />

        {/* Canonical (recommended for non-home pages) */}
        <link rel="canonical" href="https://echoesofhistoryai.org/features" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://echoesofhistoryai.org/features" />
        <meta property="og:title" content="Features | Echoes of History AI" />
        <meta
          property="og:description"
          content="Conversations with historical figures, deep follow-ups, and modern tools built to make learning feel alive."
        />
        <meta property="og:image" content="https://echoesofhistoryai.org/images/og-image.jpg" />
        <meta property="og:image:alt" content="Echoes of History AI - features" />

        {/* Twitter (no handles) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://echoesofhistoryai.org/features" />
        <meta name="twitter:title" content="Features | Echoes of History AI" />
        <meta
          name="twitter:description"
          content="Conversations with historical figures, deep follow-ups, and modern tools built to make learning feel alive."
        />
        <meta name="twitter:image" content="https://echoesofhistoryai.org/images/og-image.jpg" />
        <meta name="twitter:image:alt" content="Echoes of History AI - features" />
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
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 sm:pt-20">
              <div 
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur"
                style={{ animation: 'fadeInUp 0.6s ease-out both' }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse" />
                Features
              </div>

              <div className="mt-6 max-w-3xl" style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}>
                <h1 
                  className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl text-white"
                  style={{
                    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  Built to make history feel alive
                  <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                    and actually stick.
                  </span>
                </h1>
                <p className="mt-5 text-pretty text-base leading-relaxed text-gray-300">
                  Echoes of History is designed for real learning: quick entry points, strong context, and the freedom to
                  keep asking better questions.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="/"
                    className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-purple-500/50 hover:scale-105 overflow-hidden"
                    style={{ backgroundSize: '200% auto' }}
                  >
                    <span className="relative z-10">Start exploring</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </a>
                  <a
                    href="/about"
                    className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl shadow-sm transition hover:bg-white/10 hover:border-white/40"
                  >
                    Meet the creator
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Feature grid */}
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <div 
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}
            >
              {features.map((f, index) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:scale-[1.02]"
                  style={{ animation: `fadeInUp 0.6s ease-out ${0.5 + index * 0.1}s both` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold tracking-tight text-white">{f.title}</h2>
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      {f.icon}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-gray-300">{f.desc}</p>
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-300`} />
                </div>
              ))}
            </div>

            {/* Secondary section */}
            <div 
              className="mt-10 grid gap-4 lg:grid-cols-12"
              style={{ animation: 'fadeInUp 1.2s ease-out 1s both' }}
            >
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl p-6 shadow-xl lg:col-span-7">
                <h3 className="text-lg font-semibold tracking-tight text-white">A better default learning loop</h3>
                <ol className="mt-4 space-y-3 text-sm text-gray-200">
                  <li className="flex gap-3 group">
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-semibold text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                      1
                    </span>
                    <span>
                      <span className="font-semibold text-white">Start broad:</span> "What caused the uprising?" "Why did it spread?"
                    </span>
                  </li>
                  <li className="flex gap-3 group">
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-blue-500 text-xs font-semibold text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                      2
                    </span>
                    <span>
                      <span className="font-semibold text-white">Go specific:</span> ask about a person, decision, or turning point.
                    </span>
                  </li>
                  <li className="flex gap-3 group">
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-semibold text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                      3
                    </span>
                    <span>
                      <span className="font-semibold text-white">Stress test:</span> "What's the best counterargument?" "What did critics claim?"
                    </span>
                  </li>
                </ol>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl lg:col-span-5">
                <h3 className="text-lg font-semibold tracking-tight text-white">What I'm optimizing for</h3>
                <div className="mt-4 space-y-3 text-sm text-gray-300">
                  <div className="group flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/5 hover:border-purple-500/30">
                    <span>Clarity</span>
                    <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">High</span>
                  </div>
                  <div className="group flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/5 hover:border-pink-500/30">
                    <span>Speed</span>
                    <span className="font-semibold bg-gradient-to-r from-pink-400 to-blue-500 bg-clip-text text-transparent">Fast</span>
                  </div>
                  <div className="group flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/5 hover:border-blue-500/30">
                    <span>Depth on demand</span>
                    <span className="font-semibold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">Yes</span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm p-4 text-sm text-gray-200 shadow-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-400 text-lg mt-0.5">💡</span>
                    <p>If a feature ever makes the experience feel like "work," I treat that as a bug.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </div>

      <style jsx>{`
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

export default Features;