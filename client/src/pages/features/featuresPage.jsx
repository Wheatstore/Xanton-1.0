import React from "react";
import { Helmet } from "react-helmet";
import Footer from "../../components/landing/footer/footer";
import Navbar from "../../components/navbar/navbar";

function Features() {
  const features = [
    {
      title: "Talk to historical figures",
      desc: "Ask real questions and get responses that feel like a guided conversation—not a textbook dump.",
    },
    {
      title: "Follow-up like you’re in a seminar",
      desc: "Push back, ask “why,” and keep drilling deeper. The best learning happens in the follow-ups.",
    },
    {
      title: "Fast character discovery",
      desc: "Browse by era, theme, or topic so you’re not stuck searching for the “right” name.",
    },
    {
      title: "Context-first answers",
      desc: "Get quick background, then zoom in. Useful when you’re starting from zero or cramming for clarity.",
    },
    {
      title: "Save and continue later",
      desc: "Pick up conversations where you left off instead of restarting every time you return.",
    },
    {
      title: "Built for school + curiosity",
      desc: "Great for class topics, projects, and rabbit holes—without feeling like traditional studying.",
    },
  ];

  return (
    <>
    <Navbar />
      <Helmet>
        <title>Features — Echoes of History</title>
        <meta
          name="description"
          content="Explore Echoes of History features: conversations with historical figures, deep follow-ups, character discovery, and a modern learning experience built for curiosity."
        />
        <meta
          name="keywords"
          content="Echoes of History features, historical figures chatbot, learn history, interactive learning, conversation-based learning"
        />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="Features — Echoes of History" />
        <meta
          property="og:description"
          content="Conversations with historical figures, deep follow-ups, and modern tools built to make learning feel alive."
        />
        <meta property="og:url" content="https://www.xantonai.com/features" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://upload.wikimedia.org/wikipedia/commons/a/a3/Vehn%C3%A4pelto_6.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-48 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-zinc-200/70 blur-3xl dark:bg-zinc-800/40" />
            <div className="absolute -bottom-40 right-[-6rem] h-80 w-80 rounded-full bg-zinc-200/60 blur-3xl dark:bg-zinc-800/30" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 sm:pt-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
              Features
            </div>

            <div className="mt-6 max-w-3xl">
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Built to make history feel alive
                <span className="text-zinc-500 dark:text-zinc-400"> — and actually stick.</span>
              </h1>
              <p className="mt-5 text-pretty text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                Echoes of History is designed for real learning: quick entry points, strong context, and the freedom to
                keep asking better questions.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Start exploring
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900/40"
                >
                  Meet the creator
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold tracking-tight">{f.title}</h2>
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300">
                    ✦
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Secondary section */}
          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/30 lg:col-span-7">
              <h3 className="text-lg font-semibold tracking-tight">A better default learning loop</h3>
              <ol className="mt-4 space-y-3 text-sm text-zinc-800 dark:text-zinc-200">
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-900 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                    1
                  </span>
                  <span>
                    <span className="font-semibold">Start broad:</span> “What caused the uprising?” “Why did it spread?”
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-900 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                    2
                  </span>
                  <span>
                    <span className="font-semibold">Go specific:</span> ask about a person, decision, or turning point.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-900 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                    3
                  </span>
                  <span>
                    <span className="font-semibold">Stress test:</span> “What’s the best counterargument?” “What did critics claim?”
                  </span>
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 lg:col-span-5">
              <h3 className="text-lg font-semibold tracking-tight">What I’m optimizing for</h3>
              <div className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <span>Clarity</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">High</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <span>Speed</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">Fast</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <span>Depth on demand</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">Yes</span>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
                If a feature ever makes the experience feel like “work,” I treat that as a bug.
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default Features;
