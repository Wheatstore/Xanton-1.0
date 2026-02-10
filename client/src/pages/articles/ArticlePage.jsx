// pages/articles/ArticlePage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/landing/footer/footer";

/**
 * Fetches one article from Firestore "articles" by slug.
 * Assumes doc.id is slug (recommended).
 * If you store a separate slug field, you should store doc.id as slug anyway to keep reads simple.
 */

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | not_found | error

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

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

  // Particles
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
    const particleCount = 42;

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

  // Fetch one article
  useEffect(() => {
    const run = async () => {
      if (!slug) {
        setStatus("not_found");
        return;
      }

      console.log(slug)

      try {
        setStatus("loading");

        const ref = doc(db, "articles", slug);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setArticle(null);
          setStatus("not_found");
          return;
        }

        const data = snap.data() || {};
        setArticle({
          id: snap.id,
          slug: snap.id,
          title: data.title ?? "Untitled",
          author: data.author ?? "Unknown",
          date: data.date ?? "",
          category: data.category ?? "",
          readTime: data.readTime ?? "",
          excerpt: data.excerpt ?? "",
          coverImage: data.coverImage ?? data.image ?? "",
          content: data.content ?? "",
        });

        setStatus("ready");
      } catch (e) {
        console.error("Error fetching article:", e);
        setStatus("error");
      }
    };

    run();
  }, [slug]);

  const canonical = useMemo(() => {
    const base = "https://echoesofhistoryai.org";
    return slug ? `${base}/articles/${slug}` : `${base}/articles`;
  }, [slug]);

  const paragraphs = useMemo(() => {
    const text = article?.content ?? "";
    return text
      .split(/\n{2,}/g)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [article]);

  return (
    <>
      <Navbar />

      <Helmet>
        <title>
          {status === "ready" ? `${article.title} | Echoes of History AI` : "Article | Echoes of History AI"}
        </title>
        <meta
          name="description"
          content={
            status === "ready"
              ? article.excerpt || article.content?.slice(0, 160) || "Read this article on Echoes of History AI."
              : "Read an article on Echoes of History AI."
          }
        />
        <link rel="canonical" href={canonical} />

        {status === "ready" && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: article.title,
              author: article.author ? { "@type": "Person", name: article.author } : undefined,
              datePublished: article.date || undefined,
              description: article.excerpt || undefined,
              mainEntityOfPage: canonical,
            })}
          </script>
        )}
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

        <main className="relative mx-auto max-w-4xl px-6 pb-16 pt-14 sm:pt-16">
          <div className="mb-8 flex items-center justify-between">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/10 hover:border-white/20"
            >
              <span className="opacity-70">←</span> Back to articles
            </Link>

            {status === "ready" && (
              <div className="text-xs text-gray-400">
                {article.category ? <span className="mr-3">{article.category}</span> : null}
                {article.readTime ? <span>{article.readTime}</span> : null}
              </div>
            )}
          </div>

          {status === "loading" && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-xl">
              <div className="h-7 w-2/3 rounded-lg bg-white/10" />
              <div className="mt-3 h-4 w-1/3 rounded bg-white/5" />
              <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded bg-white/5" />
                <div className="h-4 w-11/12 rounded bg-white/5" />
                <div className="h-4 w-10/12 rounded bg-white/5" />
              </div>
            </div>
          )}

          {status === "not_found" && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center shadow-xl">
              <h1 className="text-2xl font-semibold text-white">Article not found</h1>
              <p className="mt-2 text-sm text-gray-400">The link is wrong or the article isn’t published.</p>
              <Link
                to="/articles"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-purple-500/40"
                style={{ backgroundSize: "200% auto" }}
              >
                Browse articles
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center shadow-xl">
              <h1 className="text-2xl font-semibold text-white">Couldn’t load this article</h1>
              <p className="mt-2 text-sm text-gray-400">
                Check Firestore permissions and confirm the doc exists at articles/{slug}.
              </p>
            </div>
          )}

          {status === "ready" && (
            <article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
              {article.coverImage ? (
                <div className="border-b border-white/10">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="h-56 w-full object-cover sm:h-72"
                    loading="lazy"
                  />
                </div>
              ) : null}

              <div className="p-7 sm:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-purple-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse" />
                  Article
                </div>

                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {article.title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                  <span className="text-gray-300 font-medium">{article.author}</span>
                  {article.date ? <span className="opacity-70">{article.date}</span> : null}
                  {article.readTime ? <span className="opacity-70">{article.readTime}</span> : null}
                </div>

                {article.excerpt ? (
                  <p className="mt-6 text-base leading-relaxed text-gray-200">{article.excerpt}</p>
                ) : null}

                <div className="mt-8 space-y-5">
                  {paragraphs.length ? (
                    paragraphs.map((p, idx) => (
                      <p key={idx} className="text-base leading-relaxed text-gray-200">
                        {p}
                      </p>
                    ))
                  ) : (
                    <p className="text-base leading-relaxed text-gray-300">No content yet.</p>
                  )}
                </div>
              </div>
            </article>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
