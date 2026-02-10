// pages/bots/BotsDirectory.jsx
import { db } from "../../firebase";
import { useEffect, useRef, useState, useMemo } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { Helmet } from "react-helmet-async";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/landing/footer/footer";

function BotsDirectory() {
  const [historicalFigures, setHistoricalFigures] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [search, setSearch] = useState("");
  const canvasRef = useRef(null);

  // Fade-in effect on load
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animated particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const particles = [];
    const particleCount = 55;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.15,
      });
    }

    let raf = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${p.opacity})`;
        ctx.fill();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      raf = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Fetch bots
  useEffect(() => {
    const getBots = async () => {
      try {
        const botsRef = collection(db, "bots");
        const q = query(botsRef);
        const snapshot = await getDocs(q);

        const botsList = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() || {};
          return {
            id: docSnap.id,
            ...data,
            // normalize the common fields so UI doesn't crash
            name: data.name ?? "Unknown figure",
            description: data.description ?? "",
            slug: data.slug ?? docSnap.id,
            // support either img or image in your Firestore docs
            img: data.img ?? data.image ?? "",
          };
        });

        setHistoricalFigures(botsList);
      } catch (error) {
        console.error("Error fetching bots: ", error);
      }
    };

    getBots();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return historicalFigures;
    return historicalFigures.filter((f) => {
      const name = (f.name ?? "").toLowerCase();
      const desc = (f.description ?? "").toLowerCase();
      return name.includes(s) || desc.includes(s);
    });
  }, [historicalFigures, search]);

  return (
    <>

      <div className="relative min-h-screen bg-black overflow-hidden">
        {/* particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none opacity-40"
        />

        {/* parallax orbs */}
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
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-pink-600 rounded-full opacity-10 blur-3xl transition-transform duration-1000 ease-out"
            style={{
              transform: `translate(calc(-50% + ${mousePosition.x * 0.5}px), calc(-50% + ${
                mousePosition.y * 0.5
              }px))`,
            }}
          />
        </div>

        {/* grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* content */}
        <div
          className={`relative transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* hero */}
          <section className="relative overflow-hidden">
            <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 sm:pt-20">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur"
                style={{ animation: "fadeInUp 0.6s ease-out both" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse" />
                Directory
              </div>

              <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
                <div
                  className="lg:col-span-8"
                  style={{ animation: "fadeInUp 0.8s ease-out 0.2s both" }}
                >
                  <h1
                    className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl text-white"
                    style={{
                      fontFamily:
                        '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >
                    Chat with
                    <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                      historical figures.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-gray-300">
                    Browse the library, pick a voice, and start a conversation that feels
                    like a guided discussion—fast to start, hard to stop.
                  </p>

                  {/* search */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <span className="h-2 w-2 rounded-full bg-purple-400/80" />
                      </div>
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or description…"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-sm text-white placeholder:text-gray-500 backdrop-blur-xl outline-none transition focus:border-purple-500/40 focus:bg-white/10"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-500">
                        {filtered.length}
                      </div>
                    </div>

                    <a
                      href="/signup"
                      className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-purple-500/50 hover:scale-[1.02] overflow-hidden"
                      style={{ backgroundSize: "200% auto" }}
                    >
                      <span className="relative z-10">Create an account</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </a>
                  </div>
                </div>

                {/* stats card */}
                <div
                  className="lg:col-span-4"
                  style={{ animation: "fadeInUp 1s ease-out 0.35s both" }}
                >
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="group rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-3 transition-all duration-300 hover:bg-white/5 hover:border-purple-500/30">
                        <p className="text-xs font-medium text-gray-500">Figures</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {historicalFigures.length}
                        </p>
                      </div>
                      <div className="group rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-3 transition-all duration-300 hover:bg-white/5 hover:border-pink-500/30">
                        <p className="text-xs font-medium text-gray-500">Mode</p>
                        <p className="mt-1 text-sm font-semibold text-white">Explore</p>
                      </div>
                      <div className="group col-span-2 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-3 transition-all duration-300 hover:bg-white/5 hover:border-blue-500/30">
                        <p className="text-xs font-medium text-gray-500">Tip</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          Try: “What did you fear most?” or “Explain it like I’m 12.”
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* grid */}
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <div
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              style={{ animation: "fadeInUp 1.1s ease-out 0.45s both" }}
            >
              {filtered.map((figure) => {
                const imgSrc = figure.img
                  ? figure.img.startsWith("http")
                    ? figure.img
                    : figure.img
                  : null;

                return (
                  <article
                    key={figure.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl transition-all duration-300 hover:bg-white/10 hover:border-purple-500/30 hover:-translate-y-1"
                  >
                    {/* glow */}
                    <div className="pointer-events-none absolute -inset-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-3xl" />
                    </div>

                    <div className="relative p-4">
                      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={figure.name}
                            loading="lazy"
                            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-48 w-full items-center justify-center text-xs text-gray-500">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <h2 className="text-lg font-semibold tracking-tight text-white">
                          {figure.name}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-gray-300 line-clamp-3">
                          {figure.description || "No description yet."}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <a
                            href={`/signup?bot=${encodeURIComponent(figure.slug)}`}
                            className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 border border-white/10 hover:border-white/20"
                          >
                            Start chatting
                          </a>

                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* empty state */}
            {!filtered.length && (
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center shadow-xl">
                <p className="text-sm text-gray-300">No figures match your search.</p>
                <p className="mt-1 text-xs text-gray-500">
                  Try a broader keyword (e.g., “war”, “science”, “poetry”).
                </p>
              </div>
            )}
          </section>

        </div>
      </div>

      <style jsx="true">{`
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

export default BotsDirectory;
