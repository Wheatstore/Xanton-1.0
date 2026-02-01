import React from "react";
import { Helmet } from "react-helmet";
import Footer from "../../components/landing/footer/footer";
import Navbar from "../../components/navbar/navbar";

function About() {
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

      <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-48 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-zinc-200/70 blur-3xl dark:bg-zinc-800/40" />
            <div className="absolute -bottom-40 right-[-6rem] h-80 w-80 rounded-full bg-zinc-200/60 blur-3xl dark:bg-zinc-800/30" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-16 sm:pt-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
              About
            </div>

            <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                  Echoes of History
                  <span className="text-zinc-500 dark:text-zinc-400"> — where learning feels like a conversation.</span>
                </h1>

                <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                  I built Echoes of History because I wanted history to feel less like memorizing and more like meeting
                  people. Instead of scrolling through summaries, you can ask questions, challenge ideas, and explore
                  context—one conversation at a time.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="/"
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    Explore the site
                  </a>
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900/40"
                  >
                    Browse historical figures
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Vehn%C3%A4pelto_6.jpg"
                    alt="Wheat field"
                    className="h-56 w-full rounded-xl object-cover sm:h-64"
                    loading="lazy"
                  />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Focus</p>
                      <p className="mt-1 text-sm font-semibold">History through dialogue</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Goal</p>
                      <p className="mt-1 text-sm font-semibold">Curiosity over cramming</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Style</p>
                      <p className="mt-1 text-sm font-semibold">Fast, clean, modern</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Built by</p>
                      <p className="mt-1 text-sm font-semibold">A student creator</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-lg font-semibold tracking-tight">Why it exists</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                A lot of “studying” is passive. Echoes of History is built around active learning: asking, following up,
                disagreeing, and connecting events to bigger themes.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-lg font-semibold tracking-tight">How it works</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                Each figure is designed to respond in a clear, engaging voice. The best conversations feel like a guided
                discussion—quick to start, hard to stop.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-lg font-semibold tracking-tight">Where it’s going</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                I’m focused on making the experience smoother, more accurate, and more fun—better character discovery,
                better continuity, and more ways to learn beyond a single chat.
              </p>
            </div>
          </div>

          {/* Quote / signature */}
          <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
            <p className="text-pretty text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              “History sticks when it feels human. If Echoes of History makes you ask one extra question, it’s doing its job.”
            </p>
            <p className="mt-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400">— Wheatstore</p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default About;
