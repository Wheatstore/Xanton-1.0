import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import DirectoryFigureCard from "./DirectoryFigureCard";

const filters = [
  { id: "all", label: "All figures", keywords: [] },
  { id: "leaders", label: "Leaders", keywords: ["president", "leader", "king", "queen", "emperor", "general", "statesman", "activist", "politician"] },
  { id: "science", label: "Science & invention", keywords: ["scientist", "inventor", "physicist", "chemist", "mathematician", "astronomer", "engineer", "doctor"] },
  { id: "ideas", label: "Thinkers & writers", keywords: ["philosopher", "writer", "author", "poet", "scholar", "theologian", "economist"] },
  { id: "arts", label: "Arts & culture", keywords: ["artist", "painter", "musician", "composer", "architect", "actor", "filmmaker"] },
];

function searchableText(figure) {
  return [figure.name, figure.description, figure.biography, figure.role, figure.occupation, figure.knownFor, figure.era, figure.country]
    .filter(Boolean).join(" ").toLowerCase();
}

export default function BotsDirectory() {
  const [figures, setFigures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    async function loadFigures() {
      try {
        const snapshot = await getDocs(query(collection(db, "bots")));
        setFigures(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      } catch (error) {
        console.error("Error fetching figures:", error);
      } finally { setLoading(false); }
    }
    loadFigures();
  }, []);

  const visibleFigures = useMemo(() => {
    const term = search.trim().toLowerCase();
    const selected = filters.find((filter) => filter.id === activeFilter);
    const matching = figures.filter((figure) => {
      const text = searchableText(figure);
      const matchesSearch = !term || text.includes(term);
      const matchesFilter = activeFilter === "all" || selected.keywords.some((keyword) => text.includes(keyword));
      return matchesSearch && matchesFilter;
    });
    return sort === "alphabetical" ? [...matching].sort((a, b) => (a.name || "").localeCompare(b.name || "")) : matching;
  }, [activeFilter, figures, search, sort]);

  const clearFilters = () => { setSearch(""); setActiveFilter("all"); };

  return (
    <main className="bd-directory">
      <header className="bd-header">
        <div className="bd-header-copy">
          <p className="bd-eyebrow"><Sparkles /> Conversations with the past</p>
          <h1>Who would you like to meet?</h1>
          <p>Choose a historical figure and ask about their life, choices, ideas, or the world they knew.</p>
        </div>
        <img src="/images/art6.png" alt="" aria-hidden="true" />
      </header>

      <section className="bd-controls" aria-label="Browse historical figures">
        <label className="bd-search">
          <Search />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, era, profession, or idea" />
          {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X /></button>}
        </label>
        <div className="bd-filter-row">
          <div className="bd-filters" aria-label="Filter by field">
            {filters.map((filter) => <button type="button" key={filter.id} onClick={() => setActiveFilter(filter.id)} className={activeFilter === filter.id ? "is-active" : ""}>{filter.label}</button>)}
          </div>
          <label className="bd-sort"><SlidersHorizontal /><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="alphabetical">A–Z</option></select></label>
        </div>
      </section>

      <section className="bd-results">
        <div className="bd-results-heading"><div><h2>Explore the collection</h2><p>{loading ? "Loading figures…" : `${visibleFigures.length} ${visibleFigures.length === 1 ? "figure" : "figures"} available`}</p></div>{(search || activeFilter !== "all") && <button type="button" onClick={clearFilters}>Clear all filters</button>}</div>
        {loading ? <div className="bd-grid">{[1,2,3,4,5,6].map((item) => <div className="bd-skeleton" key={item} />)}</div> : visibleFigures.length ? <div className="bd-grid">{visibleFigures.map((figure) => <DirectoryFigureCard figure={figure} key={figure.id} />)}</div> : <div className="bd-empty"><Search /><h2>No figures found</h2><p>Try a different name or broaden your topic filter.</p><button type="button" onClick={clearFilters}>Show all figures</button></div>}
      </section>
    </main>
  );
}
