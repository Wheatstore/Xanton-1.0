import React from "react";
import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import Footer from "../../components/landing/footer/footer";
import Navbar from "../../components/navbar/navbar";

function Partners() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const outcomes = [
    {
      title: "Aligned to standards & curriculum",
      desc: "Supports inquiry-based learning in History / ELA / Civics with flexible prompts and structured context.",
      icon: "🧭",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      title: "Student engagement that scales",
      desc: "Students ask better questions when the interface feels conversational—not like a worksheet.",
      icon: "🎒",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Teacher-friendly by design",
      desc: "Clear entry points, fast discovery by era/theme, and conversation continuity for projects.",
      icon: "🧑‍🏫",
      gradient: "from-cyan-500 to-emerald-500",
    },
    {
      title: "Safe, classroom-ready use",
      desc: "Designed to reduce friction in supervised settings and keep interactions focused on learning goals.",
      icon: "🛡️",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Supports differentiation",
      desc: "Quick background for students starting from zero, and depth on demand for advanced learners.",
      icon: "🧠",
      gradient: "from-teal-500 to-indigo-500",
    },
    {
      title: "Data-informed iteration",
      desc: "Pilot feedback loops help refine what works—without disrupting classroom routines.",
      icon: "📈",
      gradient: "from-indigo-500 to-violet-500",
    },
  ];

  const useCases = [
    {
      title: "Primary-source style questioning",
      desc: "Students practice sourcing, contextualization, and corroboration through guided follow-ups.",
      icon: "🗂️",
    },
    {
      title: "Seminar / discussion warmups",
      desc: "Quick prompts to generate claims, counterclaims, and evidence before a class debate.",
      icon: "💬",
    },
    {
      title: "Project research & NHD support",
      desc: "Fast context + targeted drilling on individuals, timelines, and turning points.",
      icon: "📚",
    },
    {
      title: "Writing support for ELA",
      desc: "Use characters to explore perspective, voice, and historical argumentation.",
      icon: "✍️",
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

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animated particles canvas (slightly calmer for “educational”)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    const particles = [];
    const particleCount = 46;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        opacity: Math.random() * 0.35 + 0.15,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
        ctx.fill();
      });

      // Connect particles (fainter + fewer)
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.10 * (1 - d / 130)})`;
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

    const handleResize = () => setSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Navbar />
      <Helmet>
        <title>Partners | Echoes of History AI</title>
        <meta
          name="description"
          content="Partner with Echoes of History AI. An inquiry-based learning tool built for school districts: engaging conversations, curriculum-aligned workflows, and classroom-ready implementation."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://echoesofhistoryai.org/partners" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://echoesofhistoryai.org/partners" />
        <meta property="og:title" content="Partners | Echoes of History AI" />
        <meta
          property="og:description"
          content="A district-ready learning experience that makes history engaging, structured, and classroom-friendly."
        />
        <meta property="og:image" content="https://echoesofhistoryai.org/images/og-image.jpg" />
        <meta property="og:image:alt" content="Echoes of History AI - partners" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://echoesofhistoryai.org/partners" />
        <meta name="twitter:title" content="Partners | Echoes of History AI" />
        <meta
          name="twitter:description"
          content="A district-ready learning experience that makes history engaging, structured, and classroom-friendly."
        />
        <meta name="twitter:image" content="https://echoesofhistoryai.org/images/og-image.jpg" />
        <meta name="twitter:image:alt" content="Echoes of History AI - partners" />
      </Helmet>

      <div className="relative min-h-screen bg-black overflow-hidden">
        {/* Animated particle canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-35" />

        {/* Dynamic background gradients with parallax (more “institutional” calm) */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 -left-24 w-[420px] h-[420px] bg-indigo-600 rounded-full opacity-18 blur-3xl transition-transform duration-700 ease-out"
            style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
          />
          <div
            className="absolute bottom-1/4 -right-24 w-[540px] h-[540px] bg-blue-600 rounded-full opacity-18 blur-3xl transition-transform duration-700 ease-out"
            style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
          />
          <div
            className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-cyan-600 rounded-full opacity-8 blur-3xl transition-transform duration-1000 ease-out"
            style={{
              transform: `translate(calc(-50% + ${mousePosition.x * 0.45}px), calc(-50% + ${
                mousePosition.y * 0.45
              }px))`,
            }}
          />

          {/* Top transition fade (seamless with previous section) */}
          <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-black to-transparent" />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Grid overlay (slightly more subtle) */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "54px 54px",
          }}
        />

        {/* Content */}
        <div
          className={`relative transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 sm:pt-20">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-blue-200/90 backdrop-blur"
                style={{ animation: "fadeInUp 0.6s ease-out both" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 animate-pulse" />
                For School Districts
              </div>

              <div className="mt-6 max-w-3xl" style={{ animation: "fadeInUp 0.8s ease-out 0.2s both" }}>
                <h1
                  className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl text-white"
                  style={{
                    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  A modern way to teach history
                  <span className="block mt-2 bg-gradient-to-r from-indigo-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    built for classrooms.
                  </span>
                </h1>

                <p className="mt-5 text-pretty text-base leading-relaxed text-gray-300">
                  Echoes of History AI helps students learn through inquiry: asking questions, testing ideas, and building
                  understanding over time. Designed to fit into real instruction—without extra overhead.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="/contact"
                    className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-blue-500/40 hover:scale-105 overflow-hidden"
                    style={{ backgroundSize: "200% auto" }}
                  >
                    <span className="relative z-10">Request a district pilot</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </a>

                  <a
                    href="/features"
                    className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl shadow-sm transition hover:bg-white/10 hover:border-white/40"
                  >
                    View features
                  </a>
                </div>

                {/* Proof / posture row */}
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    { k: "Designed for inquiry", v: "Questions → evidence → refinement" },
                    { k: "Classroom pacing", v: "Warmups, seminars, projects" },
                    { k: "Low lift", v: "Simple adoption + fast onboarding" },
                  ].map((item) => (
                    <div
                      key={item.k}
                      className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl px-4 py-3 shadow-lg"
                    >
                      <div className="text-[11px] text-white/50">{item.k}</div>
                      <div className="mt-1 text-sm font-medium text-white/85">{item.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Outcomes grid */}
          <section className="mx-auto max-w-6xl px-6 pb-10">
            <div
              className="flex items-end justify-between gap-4"
              style={{ animation: "fadeInUp 1s ease-out 0.35s both" }}
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  What districts get
                </h2>
                <p className="mt-1 text-sm text-white/45 max-w-[70ch]">
                  Practical outcomes for instruction—engagement, clarity, and a consistent student learning loop.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/40">
                Built to feel educational, not “edtech-y”
              </div>
            </div>

            <div
              className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              style={{ animation: "fadeInUp 1s ease-out 0.45s both" }}
            >
              {outcomes.map((f, idx) => (
                <div
                  key={f.title}
                  className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:scale-[1.01]"
                  style={{ animation: `fadeInUp 0.6s ease-out ${0.55 + idx * 0.08}s both` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight text-white">{f.title}</h3>
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                      aria-hidden="true"
                    >
                      {f.icon}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-gray-300">{f.desc}</p>
                  <div
                    className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-6 blur-xl transition-opacity duration-300`}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Use cases + Implementation */}
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <div className="mt-6 grid gap-4 lg:grid-cols-12" style={{ animation: "fadeInUp 1.1s ease-out 0.9s both" }}>
              {/* Use cases */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl lg:col-span-7">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight text-white">Where it fits in instruction</h3>
                  <span className="text-[11px] text-white/40">Examples</span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {useCases.map((u) => (
                    <div
                      key={u.title}
                      className="group rounded-2xl border border-white/10 bg-black/20 px-4 py-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/5 hover:border-indigo-500/30"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-lg">
                          {u.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white/85">{u.title}</div>
                          <div className="mt-1 text-[12px] leading-relaxed text-white/45">{u.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900/20 to-cyan-900/15 p-4">
                  <div className="text-[11px] text-white/55">Sample learning loop</div>
                  <ol className="mt-2 space-y-2 text-sm text-gray-200">
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-xs font-semibold text-white shadow-md">
                        1
                      </span>
                      <span>
                        <span className="font-semibold text-white">Start broad:</span> clarify the situation, timeline, and key actors.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-semibold text-white shadow-md">
                        2
                      </span>
                      <span>
                        <span className="font-semibold text-white">Go specific:</span> drill into decisions, tradeoffs, and consequences.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 text-xs font-semibold text-white shadow-md">
                        3
                      </span>
                      <span>
                        <span className="font-semibold text-white">Stress test:</span> generate counterarguments and evaluate evidence.
                      </span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Implementation */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl lg:col-span-5">
                <h3 className="text-lg font-semibold tracking-tight text-white">Implementation (pilot-ready)</h3>
                <p className="mt-2 text-sm text-white/45">
                  A straightforward pathway from “try it” to district-wide adoption.
                </p>

                <div className="mt-4 space-y-3 text-sm text-gray-300">
                  {[
                    { step: "Pilot", body: "Select schools/teachers + define goals (engagement, writing, seminar prep)." },
                    { step: "Onboard", body: "Quick start guide + example lesson workflows (warmups, projects, discussion)." },
                    { step: "Measure", body: "Collect teacher feedback + student usage signals to refine what works." },
                    { step: "Scale", body: "Roll out with pacing guides and support artifacts based on pilot results." },
                  ].map((row) => (
                    <div
                      key={row.step}
                      className="group flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/5 hover:border-cyan-500/25"
                    >
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05] border border-white/10 text-[11px] font-semibold text-white/70">
                        {row.step[0]}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white/85">{row.step}</div>
                        <div className="mt-0.5 text-[12px] leading-relaxed text-white/45">{row.body}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/25 to-blue-900/15 backdrop-blur-sm p-4 text-sm text-gray-200 shadow-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-300 text-lg mt-0.5">📝</span>
                    <p>
                      Want a one-page overview for your leadership team? I can provide a concise PDF summary tailored to
                      your district priorities.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="/contact"
                    className="group relative inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-blue-500/40 hover:scale-[1.02] overflow-hidden"
                    style={{ backgroundSize: "200% auto" }}
                  >
                    <span className="relative z-10">Contact for partnerships</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </a>

                  <a
                    href="/"
                    className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl shadow-sm transition hover:bg-white/10 hover:border-white/40"
                  >
                    View demo
                  </a>
                </div>

                <div className="mt-4 text-[11px] text-white/35">
                  Note: AI-generated content can be imperfect. Classroom use works best with teacher guidance and clear
                  objectives.
                </div>
              </div>
            </div>
          </section>

          <Footer />
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

export default Partners;