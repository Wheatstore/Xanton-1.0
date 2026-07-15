/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid2x2,
  LayoutList,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import BotCard from "./bot-card/botCard";
import { db } from "../../firebase";
import { collection, getDocs, query } from "firebase/firestore";

const filterOptions = [
  { value: "all", label: "All figures" },
  { value: "science", label: "Scientists" },
  { value: "philosophy", label: "Philosophers" },
  { value: "leaders", label: "Leaders" },
];

const categoryKeywords = {
  science: [
    "scientist",
    "inventor",
    "mathematician",
    "physicist",
    "chemist",
    "biologist",
    "astronomer",
  ],
  philosophy: [
    "philosopher",
    "thinker",
    "writer",
    "theologian",
    "scholar",
  ],
  leaders: [
    "leader",
    "president",
    "king",
    "queen",
    "emperor",
    "general",
    "statesman",
    "prime minister",
    "activist",
  ],
};

function Product({ isLanding }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [bots, setBots] = useState([]);
  const [loadingBots, setLoadingBots] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    const getBots = async () => {
      try {
        const botsRef = collection(db, "bots");
        const q = query(botsRef);
        const snapshot = await getDocs(q);

        const botsList = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        setBots(botsList);
      } catch (error) {
        console.error("Error fetching bots: ", error);
      } finally {
        setLoadingBots(false);
      }
    };

    getBots();
  }, []);

  const displayedBots = isLanding ? bots.slice(0, 8) : bots;

  const filteredBots = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return displayedBots.filter((bot) => {
      const searchableFields = [
        bot.name,
        bot.description,
        bot.category,
        bot.type,
        bot.role,
        bot.occupation,
        bot.knownFor,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableFields.includes(normalizedSearch);

      const matchesFilter =
        filter === "all" ||
        categoryKeywords[filter]?.some((keyword) =>
          searchableFields.includes(keyword)
        );

      return matchesSearch && matchesFilter;
    });
  }, [displayedBots, filter, search]);

  const sectionStats = [
    { label: "Figures archived", value: `${bots.length || 0}` },
    { label: "Live conversations", value: "20K+" },
    { label: "Curated themes", value: "Archive-led" },
  ];

  return (
    <section className="product-archive relative overflow-hidden bg-[#f6f0e4] text-stone-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(221,196,153,0.35),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(210,214,203,0.55),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.65),rgba(246,240,228,0.92))]" />
        <div className="absolute left-[8%] top-16 h-48 w-48 rounded-full bg-[#e6d3b6]/35 blur-3xl" />
        <div className="absolute bottom-10 right-[10%] h-56 w-56 rounded-full bg-[#d9ddd3]/55 blur-3xl" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(88,74,57,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(88,74,57,0.04)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_360px] lg:items-start">
          <div className="rounded-[32px] border border-stone-200/80 bg-[rgba(255,252,247,0.82)] p-7 shadow-[0_30px_80px_rgba(58,44,29,0.08)] backdrop-blur-xl sm:p-9">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                {isLanding ? "Featured collection" : "Historical catalog"}
              </span>
              <span className="h-px w-16 bg-stone-300" />
              <span>Curated conversations</span>
            </div>

            <div className="mt-6 space-y-5">
              <h2 className="max-w-4xl font-serif text-4xl leading-[0.94] text-stone-950 sm:text-5xl lg:text-[4.25rem]">
                {isLanding
                  ? "Enter the archive through the people who shaped it."
                  : "Browse the archive like a reading room, not a directory."}
              </h2>
              <p className="max-w-3xl text-base leading-8 text-stone-600 sm:text-lg">
                {isLanding
                  ? "Each figure is presented as a living dossier: portrait, context, and a direct path into conversation. The experience should feel thoughtful before the first question is even asked."
                  : `Explore ${bots.length} historical figures through a calmer, more editorial catalog. Search by name, scan by theme, and open a conversation from a card that feels more like a collected document than a generic tile.`}
              </p>
            </div>

            {!isLanding && (
              <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                <label className="group flex items-center gap-3 rounded-[24px] border border-stone-200 bg-white/90 px-4 py-3 shadow-[0_16px_30px_rgba(58,44,29,0.05)] transition focus-within:border-stone-400">
                  <Search className="h-4 w-4 text-stone-400 transition group-focus-within:text-stone-700" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search the archive by name, role, or theme"
                    className="w-full bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
                  />
                  <span className="rounded-full border border-stone-200 bg-[#f6f0e4] px-2.5 py-1 text-[11px] font-semibold text-stone-500">
                    {filteredBots.length}
                  </span>
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="inline-flex items-center rounded-[22px] border border-stone-200 bg-white/85 p-1 shadow-[0_12px_24px_rgba(58,44,29,0.05)]">
                    <button
                      type="button"
                      onClick={() => setIsGridView(true)}
                      className={`inline-flex items-center gap-2 rounded-[18px] px-4 py-2.5 text-sm font-medium transition ${
                        isGridView
                          ? "bg-stone-950 text-white shadow-[0_10px_24px_rgba(28,25,23,0.16)]"
                          : "text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      <Grid2x2 className="h-4 w-4" />
                      Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsGridView(false)}
                      className={`inline-flex items-center gap-2 rounded-[18px] px-4 py-2.5 text-sm font-medium transition ${
                        !isGridView
                          ? "bg-stone-950 text-white shadow-[0_10px_24px_rgba(28,25,23,0.16)]"
                          : "text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      <LayoutList className="h-4 w-4" />
                      List
                    </button>
                  </div>

                  <div className="relative">
                    <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <select
                      value={filter}
                      onChange={(event) => setFilter(event.target.value)}
                      className="min-w-[190px] appearance-none rounded-[22px] border border-stone-200 bg-white/90 py-3 pl-11 pr-10 text-sm font-medium text-stone-700 shadow-[0_12px_24px_rgba(58,44,29,0.05)] outline-none transition hover:border-stone-300 focus:border-stone-500"
                    >
                      {filterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-[32px] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,238,228,0.92))] p-6 shadow-[0_25px_60px_rgba(58,44,29,0.08)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">
              Archive index
            </p>
            <h3 className="mt-3 font-serif text-2xl text-stone-950">
              A catalog that feels collected, not crowded.
            </h3>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              The new layout leans into paper textures, calmer surfaces, and
              richer type so discovery feels more like browsing a special
              collection.
            </p>

            <div className="mt-6 space-y-3 border-t border-stone-200 pt-6">
              {sectionStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[22px] border border-stone-200/80 bg-white/80 px-4 py-4"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-serif text-2xl text-stone-950">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-10">
          {loadingBots ? (
            <div
              className={`grid gap-6 ${
                isGridView
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-[30px] border border-stone-200 bg-white/80 p-4 shadow-[0_18px_40px_rgba(58,44,29,0.06)]"
                >
                  <div className="animate-pulse rounded-[24px] bg-[linear-gradient(180deg,#ebe1d0,#f6f0e4)]">
                    <div className="aspect-[3/4] rounded-[24px]" />
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="h-6 w-2/3 rounded-full bg-stone-200" />
                    <div className="h-4 w-5/6 rounded-full bg-stone-100" />
                    <div className="h-4 w-1/2 rounded-full bg-stone-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBots.length > 0 ? (
            <div
              className={
                isGridView
                  ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
                  : "flex flex-col gap-5"
              }
            >
              {filteredBots.map((bot, index) => (
                <div
                  key={bot.id}
                  className="archive-figure-appear"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <BotCard
                    person={bot}
                    index={index}
                    isGridView={isLanding ? true : isGridView}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[32px] border border-stone-200 bg-white/85 p-10 text-center shadow-[0_20px_50px_rgba(58,44,29,0.06)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                No match found
              </p>
              <h3 className="mt-3 font-serif text-3xl text-stone-950">
                Nothing in the archive matches that search yet.
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-600">
                Try a broader name, switch the theme filter, or clear the search
                to browse the full collection again.
              </p>
            </div>
          )}
        </div>

        {isLanding && bots.length > 8 && (
          <div className="mt-16 rounded-[32px] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(244,238,228,0.95))] p-8 text-center shadow-[0_22px_50px_rgba(58,44,29,0.08)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">
              Continue reading
            </p>
            <h3 className="mt-3 font-serif text-3xl text-stone-950">
              Explore the full archive of historical voices.
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-600">
              Move beyond the featured figures and browse the broader catalog of
              people, eras, and conversations.
            </p>
            <button
              type="button"
              onClick={() => navigate("/bots")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
            >
              Explore full collection
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}

        {!isLanding && (
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                label: "Total figures",
                value: bots.length || 0,
                description: "A growing set of voices from across eras.",
              },
              {
                label: "Conversation tone",
                value: "Editorial",
                description: "Calmer, more immersive surfaces for discovery.",
              },
              {
                label: "Best use",
                value: "Ask deeply",
                description: "Open with biography, decisions, or defining moments.",
              },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="archive-figure-appear rounded-[28px] border border-stone-200/80 bg-white/80 p-6 shadow-[0_18px_40px_rgba(58,44,29,0.06)]"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
                  {stat.label}
                </p>
                <p className="mt-3 font-serif text-3xl text-stone-950">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .product-archive {
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .product-archive .font-serif {
          font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
        }

        .archive-figure-appear {
          animation: archiveFigureAppear 0.55s ease-out both;
        }

        @keyframes archiveFigureAppear {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export default Product;
