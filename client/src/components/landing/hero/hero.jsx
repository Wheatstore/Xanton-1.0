import React, { useEffect, useRef, useState } from "react";
import FloatingLines from "./FloatingLines";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredName, setHoveredName] = useState(null);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Fade-in effect on load
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Animated particles canvas (recolored + toned down)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setSize();

    const particles = [];
    const particleCount = 48; // lighter than 60

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        opacity: Math.random() * 0.35 + 0.12,
      });
    }

    let raf = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity * 0.6})`; // slate-ish
        ctx.fill();
      }

      // connections (subtle, blue)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const a = 0.08 * (1 - dist / 120);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${a})`; // soft blue
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", setSize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  const historicalFigures = [
    { name: "Gandhi", color: "from-slate-200 to-blue-300" },
    { name: "Einstein", color: "from-sky-200 to-blue-400" },
    { name: "Newton", color: "from-blue-200 to-indigo-400" },
    { name: "Galileo", color: "from-cyan-200 to-sky-400" },
  ];

  const handleNavigation = (page) => {
    navigate(`/${page}`);
  };

  // single source image (you can swap these later for different figures)
  const floatingSrc = "/images/georgewashington-nobg.png";

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={5}
          lineDistance={5}
          bendRadius={5}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />

        {/* Optional particles (subtle). Remove this entire canvas block if you want max performance. */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-35"
        />

        {/* Subtle dark veil so lines sit "inside" black */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Bottom fade-to-black for seamless transition */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />
      </div>

      {/* Content container */}
      <div
        className={`relative w-full min-h-screen flex flex-col justify-center items-center px-6 py-20 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Top label */}
        <div className="mb-8 text-slate-300/80 text-xs uppercase tracking-[0.32em] font-semibold">
          Conversations with the past
        </div>

        {/* Title block wrapper so we can float images around it */}
        <div className="relative w-full max-w-6xl mb-8">

          {/* Left (centered vertically) */}
          <img
            src={floatingSrc}
            alt="George Washington"
            className="
              pointer-events-none select-none
              absolute -left-20 sm:-left-24 md:-left-40 lg:-left-52 xl:-left-70
              top-80 -translate-y-1/2
              w-20 sm:w-24 md:w-32 lg:w-40 xl:w-44
              opacity-100
              drop-shadow-[0_22px_70px_rgba(37,99,235,0.22)]
              animate-floatAroundLeft
            "
            style={{ filter: "saturate(1.05) contrast(1.05)" }}
            loading="eager"
            decoding="async"
          />

          {/* Right (upper) */}
          <img
            src='/images/gandhi-nobg.png'
            alt=""
            aria-hidden="true"
            className="
              pointer-events-none select-none
              absolute -right-16 sm:-right-24 md:-right-40 lg:-right-52 xl:-right-64
              top-[6%]
              w-20 sm:w-24 md:w-32 lg:w-36 xl:w-40
              opacity-100
              drop-shadow-[0_20px_60px_rgba(37,99,235,0.18)]
              animate-floatAroundRight
            "
            style={{ transformOrigin: "center", filter: "saturate(1.03) contrast(1.03)" }}
            loading="eager"
            decoding="async"
          />

          {/* Top-left (hide on small screens to avoid crowding) */}
          <img
            src='/images/genghis-nobg.png'
            alt=""
            aria-hidden="true"
            className="
              pointer-events-none select-none
              absolute left-[2%] md:left-[4%] lg:left-1 xl:left-0.5
              -top-20 md:-top-24 lg:-top-50
              hidden md:block
              w-15 md:w-24 lg:w-28 xl:w-32
              opacity-100
              drop-shadow-[0_18px_55px_rgba(37,99,235,0.14)]
              animate-floatAroundTop
            "
            style={{ transformOrigin: "center", filter: "saturate(1.0) contrast(1.0)" }}
            loading="eager"
            decoding="async"
          />

          {/* Bottom-right (hide on small screens to keep title clean) */}
          <img
            src='/images/mlk-nobg.png'
            alt=""
            aria-hidden="true"
            className="
              pointer-events-none select-none
              absolute right-[2%] md:right-[4%] lg:right-[5%]
              -bottom-20 md:-bottom-24 lg:-bottom-28
              hidden md:block
              w-20 md:w-24 lg:w-28 xl:w-32
              opacity-100
              drop-shadow-[0_18px_55px_rgba(37,99,235,0.12)]
              animate-floatAroundBottom
            "
            style={{ transformOrigin: "center", filter: "saturate(1.0) contrast(1.0)" }}
            loading="eager"
            decoding="async"
          />

          {/* Main heading */}
          <h1
            className="w-full font-black text-white leading-[1.02] tracking-tight text-center"
            style={{
              fontSize: "clamp(64px, 10vw, 120px)",
              fontFamily:
                '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              textShadow: "0 0 90px rgba(37, 99, 235, 0.25)",
            }}
          >
            Ready to talk to{" "}
            <span
              className="inline-block bg-gradient-to-r from-sky-200 via-blue-400 to-indigo-500 bg-clip-text text-transparent relative"
              style={{
                backgroundSize: "140% auto",
                animation: "gradient 6s ease infinite",
              }}
            >
              History
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-400/20 blur-2xl opacity-40 -z-10" />
            </span>
          </h1>
        </div>

        {/* Optional "museum label" line */}
        <div className="mb-10 flex items-center gap-3 text-slate-400/80 text-[11px] uppercase tracking-[0.28em]">
          <span className="h-px w-10 bg-slate-600/60" />
          Interview • Context • Evidence
          <span className="h-px w-10 bg-slate-600/60" />
        </div>

        {/* Interactive names showcase */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 px-4">
          {historicalFigures.map((figure, index) => (
            <button
              key={figure.name}
              onMouseEnter={() => setHoveredName(figure.name)}
              onMouseLeave={() => setHoveredName(null)}
              onClick={() => handleNavigation("explore")}
              className="group relative px-6 py-3 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:scale-[1.06] hover:border-white/25"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.08}s both`,
              }}
            >
              <span
                className={`relative z-10 text-base font-semibold transition-all duration-300 ${
                  hoveredName === figure.name
                    ? "text-transparent bg-clip-text bg-gradient-to-r " +
                      figure.color
                    : "text-slate-300 group-hover:text-white"
                }`}
              >
                {figure.name}
              </span>
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${figure.color} opacity-0 group-hover:opacity-15 blur-xl transition-opacity duration-300`}
              />
            </button>
          ))}
        </div>

        {/* Subheading */}
        <h3
          className="w-full max-w-2xl px-4 sm:px-0 font-normal text-slate-300/80 text-xl sm:text-2xl leading-relaxed text-center mb-14"
          style={{
            animation: "fadeInUp 0.8s ease-out 0.25s both",
            fontFamily:
              '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Join <span className="text-white font-semibold">Echoes of History</span>{" "}
          to question, learn, and test ideas against the people who shaped them.
        </h3>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center px-8 mb-20"
          style={{ animation: "fadeInUp 1s ease-out 0.45s both" }}
        >
          <button
            onClick={() => handleNavigation("signup")}
            className="group relative flex-1 px-8 py-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-800 rounded-2xl text-white font-bold text-base text-center shadow-2xl transition-all duration-300 hover:shadow-blue-500/20 hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Get Started
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>

          <button
            onClick={() => handleNavigation("features")}
            className="group flex-1 px-8 py-5 bg-white/5 backdrop-blur-xl border-2 border-white/15 rounded-2xl text-white font-semibold text-base text-center transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105"
          >
            <span className="flex items-center justify-center gap-2">
              Learn More
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                ↗
              </span>
            </span>
          </button>
        </div>

        {/* Trust indicators */}
        <div
          className="flex flex-col items-center gap-4"
          style={{ animation: "fadeInUp 1.2s ease-out 0.65s both" }}
        >
          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <span className="font-medium">
              Used by{" "}
              <span className="text-white font-semibold">3,000+</span> curious
              readers
            </span>
          </div>
          <div className="flex gap-6 text-slate-500 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-blue-300">◦</span>
              <span>Built for inquiry</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-300">◦</span>
              <span>Context-first prompts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Local keyframes for floating portraits */}
      <style>{`
        @keyframes floatAroundLeft {
          0%   { transform: translate(-14px, -50%) rotate(-8deg); }
          25%  { transform: translate(18px, calc(-50% - 14px)) rotate(-2deg); }
          50%  { transform: translate(10px, calc(-50% + 18px)) rotate(4deg); }
          75%  { transform: translate(-18px, calc(-50% + 6px)) rotate(1deg); }
          100% { transform: translate(-14px, -50%) rotate(-8deg); }
        }
        @keyframes floatAroundRight {
          0%   { transform: translate(12px, 0px) rotate(8deg); }
          30%  { transform: translate(-10px, 14px) rotate(2deg); }
          60%  { transform: translate(-4px, -10px) rotate(-4deg); }
          100% { transform: translate(12px, 0px) rotate(8deg); }
        }
        @keyframes floatAroundTop {
          0%   { transform: translate(0px, 0px) rotate(-5deg); }
          35%  { transform: translate(18px, 12px) rotate(2deg); }
          70%  { transform: translate(-14px, 8px) rotate(6deg); }
          100% { transform: translate(0px, 0px) rotate(-5deg); }
        }
        @keyframes floatAroundBottom {
          0%   { transform: translate(0px, 0px) rotate(4deg); }
          35%  { transform: translate(-16px, -12px) rotate(-2deg); }
          70%  { transform: translate(12px, -6px) rotate(6deg); }
          100% { transform: translate(0px, 0px) rotate(4deg); }
        }
        .animate-floatAroundLeft { animation: floatAroundLeft 9.5s ease-in-out infinite; }
        .animate-floatAroundRight { animation: floatAroundRight 10.5s ease-in-out infinite; }
        .animate-floatAroundTop { animation: floatAroundTop 12s ease-in-out infinite; }
        .animate-floatAroundBottom { animation: floatAroundBottom 11.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default HeroSection;