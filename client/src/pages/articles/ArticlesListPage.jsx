// pages/articles/ArticleListPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/landing/footer/footer";

/**
 * Firestore collection: "articles"
 * Recommended fields per doc:
 *  - title: string
 *  - author: string
 *  - excerpt: string
 *  - coverImage OR image: string (url or "/images/...")
 *  - category: string
 *  - readTime: string
 *  - publishedAt: Timestamp  (RECOMMENDED for sorting)
 *  - date: string (optional display)
 *
 * Slug:
 *  - Best: doc.id is the slug
 *  - OR store a `slug` field; this code supports both.
 */

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [search, setSearch] = useState("");

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Parallax mouse tracking
  useEffect(() => {
    const handle = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 18,
        y: (e.clientY / window.innerHeight - 0.5) * 18,
      });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // Particles canvas (same style family as your About)
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
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        o: Math.random() * 0.45 + 0.15,
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
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${p.o})`;
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
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Fetch ALL articles
  useEffect(() => {
    const run = async () => {
      try {
        setStatus("loading");

        const ref = collection(db, "articles");

        // Best practice: orderBy publishedAt (Timestamp). Fallback: orderBy title.
        // If you DON'T have publishedAt yet, swap to orderBy("title", "asc") for now.
        const q = query(ref, orderBy("title", "asc"));

        const snap = await getDocs(q);

        console.log(snap)

        const list = snap.docs.map((d) => {
          const data = d.data() || {};
          const slug = data.slug ?? d.id;

          return {
            id: d.id,
            slug,
            title: data.title ?? "Untitled",
            author: data.author ?? "Unknown",
            excerpt: data.excerpt ?? "",
            category: data.category ?? "",
            readTime: data.readTime ?? "",
            date: data.date ?? "",
            coverImage: data.coverImage ?? data.image ?? "",
          };
        });

        setArticles(list);
        setStatus("ready");
      } catch (e) {
        console.error("Error fetching articles:", e);
        setStatus("error");
      }
    };

    run();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return articles;

    return articles.filter((a) => {
      const t = (a.title ?? "").toLowerCase();
      const ex = (a.excerpt ?? "").toLowerCase();
      const au = (a.author ?? "").toLowerCase();
      const cat = (a.category ?? "").toLowerCase();
      return t.includes(s) || ex.includes(s) || au.includes(s) || cat.includes(s);
    });
  }, [articles, search]);

  const canonical = "https://echoesofhistoryai.org/articles";

  return (
    <>
      <Navbar />

      <Helmet>
        <title>Articles | Echoes of History AI</title>
        <meta
          name="description"
          content="Browse articles and stories. Search by keyword and open any article to read the full piece."
        />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="relative min-h-screen bg-black overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />

        {/* Parallax orbs */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 -left-24 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl transition-transform duration-700 ease-out"
            style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
          />
          <div
            className="absolute bottom-1/4 -right-24 w-[520px] h-[520px] bg-blue-600 rounded-full opacity-20 blur-3xl transition-transform duration-700 ease-out"
            style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
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

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        <main className="relative mx-auto max-w-6xl px-6 pb-16 pt-14 sm:pt-16">
          {/* Header */}
          <section className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse" />
              Articles
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl text-white">
                  Article directory
                  <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                    open a piece and read.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-gray-300">
                  Browse the full collection, or search by title, author, category, or excerpt.
                </p>
              </div>

              <div className="lg:col-span-4">
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles…"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 pr-12 text-sm text-white placeholder:text-gray-500 backdrop-blur-xl outline-none transition focus:border-purple-500/40 focus:bg-white/10"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-gray-400">
                    {filtered.length}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Body */}
          {status === "loading" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl"
                >
                  <div className="h-40 bg-white/5" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 w-3/4 rounded bg-white/10" />
                    <div className="h-4 w-1/2 rounded bg-white/5" />
                    <div className="h-4 w-full rounded bg-white/5" />
                    <div className="h-4 w-11/12 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center shadow-xl">
              <h2 className="text-2xl font-semibold text-white">Couldn’t load articles</h2>
              <p className="mt-2 text-sm text-gray-400">
                Check Firestore rules and confirm the collection is named “articles”.
              </p>
            </div>
          )}

          {status === "ready" && (
            <>
              {!filtered.length ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center shadow-xl">
                  <h2 className="text-xl font-semibold text-white">No matches</h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Try a broader keyword (or clear search).
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((a) => (
                    <Link
                      key={a.id}
                      to={`/articles/${encodeURIComponent(a.slug)}`}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl transition-all duration-300 hover:bg-white/10 hover:border-purple-500/30 hover:-translate-y-1"
                    >
                      {/* cover */}
                      <div className="relative h-44 w-full overflow-hidden border-b border-white/10 bg-black/40">
                        {a.coverImage ? (
                          <img
                            src={a.coverImage}
                            alt={a.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="h-full w-full" />
                        )}

                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute -inset-24 rounded-full bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-3xl" />
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-400">
                          {a.category ? (
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-purple-200">
                              {a.category}
                            </span>
                          ) : null}
                          {a.readTime ? <span>{a.readTime}</span> : null}
                          {a.date ? <span className="opacity-70">{a.date}</span> : null}
                        </div>

                        <h2 className="mt-3 text-lg font-semibold tracking-tight text-white">
                          {a.title}
                        </h2>

                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-300">
                          {a.excerpt || "Open to read this article."}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-gray-400">{a.author}</span>
                          <span className="text-sm font-semibold text-white/90">Read →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
