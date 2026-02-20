import { useRef, useEffect } from "react";


/* ── Stub data — replace with real props / state ── */
const BOT_NAME = "Nikola Tesla";
const BOT_SUBTITLE = "Inventor · 1856–1943";
const CURRENT_BOT_MESSAGE =
  "Alternating current — because it was not merely a machine, but a system. A way to carry power across distance, to make cities possible, to turn imagination into infrastructure.";
const IS_SPEAKING = true;

const MESSAGES = [
  { id: 1, sender: "user", message: "What invention are you most proud of?" },
  {
    id: 2,
    sender: "assistant",
    reply: "Alternating current — because it was not merely a machine, but a system.",
  },
  { id: 3, sender: "user", message: "If you lived today, what would you build first?" },
  { id: 4, sender: "assistant", reply: null, pendingReply: true },
];

const PROMPTS = [
  { text: "Where were you born", icon: "📍" },
  { text: "Who were your siblings", icon: "👥" },
  { text: "What was your best life moment", icon: "✨" },
  { text: "What are you famous for", icon: "🏆" },
];

/* ────────────────────────────────────────────────────────────────────── */
export default function LandingChat() {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Minimal, dark, “already fits” tokens (NOT glass)
  const ui = {
    box:
      "relative w-5/7 h-[75vh] max-h-[80vh] " +
      "bg-white/[0.03] border border-white/10 rounded-3xl " +
      "shadow-[0_20px_60px_rgba(0,0,0,0.55)] " +
      "overflow-hidden",
    slab:
      "relative bg-white/[0.025] border border-white/10 rounded-2xl " +
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
    panel:
      "relative bg-black/30 border border-white/10 rounded-2xl " +
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
    pill:
      "relative bg-white/[0.04] border border-white/10 rounded-full " +
      "hover:bg-white/[0.06] active:bg-white/[0.07] transition-colors",
    btn:
      "relative bg-white/[0.05] border border-white/10 rounded-xl " +
      "hover:bg-white/[0.07] active:bg-white/[0.08] transition-colors",
    hairline: "h-px bg-gradient-to-r from-transparent via-white/10 to-transparent",
  };

  return (
    <>
      <style>{`
        /* SF Pro Display isn't legally hosted on Google Fonts.
            This stack approximates it well (macOS uses SF automatically). */
        :root {
            --sf: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
                "Inter", system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
        }

        @keyframes livePulse {
            0%,100% { opacity:1; box-shadow:0 0 4px rgba(48,209,88,.9); }
            50%      { opacity:.5; box-shadow:0 0 10px rgba(48,209,88,.9); }
        }
        @keyframes typingDot {
            0%,80%,100% { transform:scaleY(.5); opacity:.4; }
            40%          { transform:scaleY(1);  opacity:1;  }
        }
        @keyframes slideUp {
            from { opacity:0; transform:translateY(10px); }
            to   { opacity:1; transform:translateY(0); }
        }
        @keyframes soundWave {
            0%,100% { transform:scaleY(.4); }
            50%      { transform:scaleY(1); }
        }

        /* A subtle animated specular highlight (Apple-ish) */
        @keyframes sheen {
            0%   { transform: translateX(-60%) rotate(12deg); opacity:.0; }
            15%  { opacity:.22; }
            55%  { opacity:.12; }
            100% { transform: translateX(140%) rotate(12deg); opacity:0; }
        }

        /* Soft “aurora” drift for background color interest */
        @keyframes auroraDrift {
          0%   { transform: translate3d(-6%, -2%, 0) scale(1.02); filter: blur(40px); opacity: .75; }
          50%  { transform: translate3d(6%,  2%, 0) scale(1.08); filter: blur(48px); opacity: .85; }
          100% { transform: translate3d(-6%, -2%, 0) scale(1.02); filter: blur(40px); opacity: .75; }
        }

        /* Tiny noise overlay (no assets) to prevent banding */
        .noiseOverlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.08;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
          background-size: 220px 220px;
        }

        .sound-bar { animation: soundWave 0.8s ease-in-out infinite; }

        .thin-scroll { scrollbar-width:thin; scrollbar-color:rgba(255,255,255,.12) transparent; }
        .thin-scroll::-webkit-scrollbar { width:4px; }
        .thin-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,.12); border-radius:2px; }

        .sf { font-family: var(--sf); }
        .sf-tight { font-family: var(--sf); letter-spacing: -0.02em; }
        .sf-display { font-family: var(--sf); letter-spacing: -0.035em; }

        /* “Apple display” title treatment */
        .glossTitle {
            background: linear-gradient(
            180deg,
            rgba(255,255,255,.96) 0%,
            rgba(255,255,255,.78) 40%,
            rgba(255,255,255,.88) 100%
            );
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 1px 18px rgba(255,255,255,.08);
        }

        /* subtle “engraved” subtitle */
        .engraved {
            text-shadow:
            0 1px 0 rgba(0,0,0,.45),
            0 0 18px rgba(255,255,255,.06);
        }

        /* specular sheen overlay helper */
        .sheenOverlay::after {
            content: "";
            position: absolute;
            inset: -40% -60%;
            background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,.22) 35%,
            rgba(255,255,255,.06) 55%,
            transparent 70%
            );
            filter: blur(2px);
            transform: translateX(-60%) rotate(12deg);
            animation: sheen 9s ease-in-out infinite;
            pointer-events: none;
            mix-blend-mode: screen;
        }
        `}</style>

        <div className="relative w-full min-h-screen bg-black overflow-hidden
                flex flex-col items-center justify-center
                px-6 sm:px-10 lg:px-16
                py-16 sm:py-24 lg:py-32">
        {/* Background (richer blue/purple) */}
        {/* Top transition fade */}
        <div className="absolute inset-x-0 top-0 h-40 z-10 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute inset-0 -z-0 pointer-events-none">
          {/* Base vignette + gentle color pools */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(1200px 600px at 18% 22%, rgba(99,102,241,0.22), transparent 62%),
                radial-gradient(900px 520px at 78% 28%, rgba(168,85,247,0.18), transparent 60%),
                radial-gradient(1000px 700px at 50% 80%, rgba(59,130,246,0.12), transparent 65%),
                radial-gradient(1200px 900px at 50% 120%, rgba(124,58,237,0.12), transparent 70%),
                radial-gradient(1200px 900px at 50% 50%, rgba(0,0,0,0.65), rgba(0,0,0,0.92))
              `,
            }}
          />

          {/* Aurora sweep layer (subtle motion) */}
          <div
            className="absolute inset-0"
            style={{
              animation: "auroraDrift 14s ease-in-out infinite",
              background: `
                radial-gradient(900px 520px at 25% 35%, rgba(56,189,248,0.10), transparent 60%),
                radial-gradient(800px 480px at 70% 40%, rgba(147,51,234,0.12), transparent 58%),
                radial-gradient(900px 520px at 55% 75%, rgba(59,130,246,0.09), transparent 62%)
              `,
              mixBlendMode: "screen",
              opacity: 0.85,
            }}
          />

          {/* Optional: If you want FloatingLines in the background, keep it faint */}
          <div className="absolute inset-0 opacity-[0.28]">
          </div>

          {/* Subtle dark veil so visuals sit “inside” black */}
          <div className="absolute inset-0 bg-black/45" />

          {/* Noise to avoid gradient banding */}
          <div className="noiseOverlay" />

          {/* Bottom fade-to-black for seamless transition */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />
        </div>
        {/* Section heading */}
        <div className="relative z-10 w-full max-w-5/7 mb-4 px-1">
            <div className="flex items-end justify-between gap-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                        <span className="text-blue-500 text-sm font-semibold uppercase tracking-[0.2em]">
                            Preview
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight">
                        Try it <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">Now</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        
                    Preview a conversation with Nikola Tesla!
                           
                    </p>
                </div>
            </div>

            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* ── OUTER BOX ─────────────────────────────────────────── */}
        <div className={`${ui.box} flex flex-col`}>
          {/* subtle top/bottom hairlines to define the container */}
          <div className="absolute top-0 left-10 right-10 h-px bg-white/10 pointer-events-none" />
          <div className="absolute bottom-0 left-10 right-10 h-px bg-black/40 pointer-events-none" />

          {/* ── HERO: avatar + current message ────────────────────────── */}
          <div className="relative z-10 flex-none px-5 pt-5 pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Avatar */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 mx-auto sm:mx-0">
                {/* ambient glow (fits dark aesthetic, not glass) */}
                <div className="absolute inset-0 -m-5 bg-gradient-to-r from-purple-600/20 via-blue-600/15 to-violet-600/20 rounded-full blur-2xl pointer-events-none" />

                <div
                  className={
                    "relative w-full h-full rounded-full overflow-hidden " +
                    "border border-white/15 bg-black/40 " +
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_10px_30px_rgba(0,0,0,0.55)]"
                  }
                >
                  {/* ↓ swap with <img src={botProfilePicture} className="w-full h-full object-cover" /> */}
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/45 to-blue-900/45 flex items-center justify-center">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/xanton-1.firebasestorage.app/o/Nikola%20Tesla.webp?alt=media&token=c007069a-c674-4fcf-80f0-b4ddd6af180d"
                      alt="Nikola Tesla"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {IS_SPEAKING && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 items-end">
                      {[6, 9, 5, 8, 6].map((h, i) => (
                        <div
                          key={i}
                          className="sound-bar w-0.5 rounded-full bg-gradient-to-t from-purple-400 to-blue-400"
                          style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Current message display */}
              <div className="flex-1 min-w-0">
                <div className={`${ui.slab} p-4`}>
                  <div className={`mb-3 ${ui.hairline}`} />

                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"
                      style={{ animation: "livePulse 2s ease-in-out infinite" }}
                    />
                    <h2
                      className="font-semibold text-sm text-white tracking-tight"
                        style={{
                        fontFamily:
                            '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                        textShadow: "0 0 90px rgba(37, 99, 235, 0.25)",
                        }}
                    >
                      {BOT_NAME}
                    </h2>
                    <span className="text-white/40 text-[11px]">{BOT_SUBTITLE}</span>
                  </div>

                  <div className={`${ui.panel} p-3 max-h-[18vh] overflow-y-auto thin-scroll`}>
                    {CURRENT_BOT_MESSAGE ? (
                      <p className="text-white/88 leading-relaxed text-xs sm:text-sm">
                        {CURRENT_BOT_MESSAGE}
                      </p>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 text-white/30">
                        <p className="italic text-xs">Awaiting your first message…</p>
                      </div>
                    )}
                  </div>

                  <div className={`mt-3 ${ui.hairline}`} />
                </div>
              </div>
            </div>
          </div>

          {/* divider */}
          <div className="relative z-10 mx-5 mt-4">
            <div className={ui.hairline} />
          </div>

          {/* ── MESSAGE HISTORY ─────────────────────────────────────────── */}
          <div className="relative z-10 flex-1 overflow-y-auto thin-scroll px-5 py-3">
            <div className="space-y-3">
              {MESSAGES.map((msg, i) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    style={{ animation: `slideUp .35s ease ${i * 0.05}s both` }}
                  >
                    {!isUser && (
                      <div
                        className={
                          "w-6 h-6 flex items-center justify-center flex-shrink-0 self-end mr-2 mb-0.5 " +
                          "rounded-full border border-white/10 bg-white/[0.04]"
                        }
                      >
                        <span className="text-[10px] select-none">
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/xanton-1.firebasestorage.app/o/Nikola%20Tesla.webp?alt=media&token=c007069a-c674-4fcf-80f0-b4ddd6af180d"
                            alt="Nikola Tesla"
                            className="rounded-full"
                          />
                        </span>
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] ${ui.panel} px-3.5 py-2.5`}
                      style={{
                        borderTopLeftRadius: isUser ? undefined : "10px",
                        borderTopRightRadius: isUser ? "10px" : undefined,
                      }}
                    >
                      {msg.pendingReply ? (
                        <div className="flex items-center gap-1.5 py-0.5">
                          {[0, 150, 300].map((d) => (
                            <div
                              key={d}
                              className="w-0.5 h-3.5 bg-white/55 rounded-full"
                              style={{ animation: `typingDot 1.4s ease-in-out ${d}ms infinite` }}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/88 leading-relaxed text-xs sm:text-sm">
                          {isUser ? msg.message : msg.reply}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>
          </div>

          {/* divider */}
          <div className="relative z-10 mx-5">
            <div className={ui.hairline} />
          </div>

          {/* ── INPUT SECTION ────────────────────────────────────────────── */}
          <div
            className="relative z-10 flex-none px-5 pt-3 pb-4"
            style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
          >
            {/* Suggested prompts */}
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
              {PROMPTS.map((p, i) => (
                <button
                  key={i}
                  className={`${ui.pill} flex-shrink-0 px-3 py-1.5 text-xs text-white/75 flex items-center gap-1.5 active:scale-95 transition-transform duration-150`}
                >
                  <span>{p.icon}</span>
                  <span className="whitespace-nowrap">{p.text}</span>
                </button>
              ))}
            </div>

            {/* Input box */}
            <div className={`${ui.slab} p-1.5`}>
              <div className="flex items-end gap-2">
                <textarea
                  placeholder="Share your thoughts…"
                  rows={1}
                  className="flex-1 bg-transparent px-4 py-2.5 resize-none focus:outline-none text-white/90 placeholder-white/30 text-sm leading-relaxed"
                  style={{ overflow: "auto", maxHeight: "100px" }}
                />
                <button
                  className={`${ui.btn} flex-shrink-0 w-10 h-10 flex items-center justify-center mb-0.5 mr-0.5 active:scale-95 transition-transform duration-150`}
                  aria-label="Send"
                >
                  <svg className="w-4 h-4 text-white/85" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* disclaimer */}
            <p className="text-[10px] text-white/28 mt-2 text-center flex items-center justify-center gap-1.5">
              <svg className="w-2.5 h-2.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              This character may provide historically inaccurate information
            </p>
          </div>
        </div>
      </div>
    </>
  );
}