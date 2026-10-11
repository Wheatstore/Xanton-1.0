/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import DirectoryFigureCard from "./DirectoryFigureCard";
import { figureText, normalizeFigure } from "./figureData";
import "./collection.css";

const filters = [
  { id: "all", label: "Everyone", keywords: [] },
  { id: "leaders", label: "Leaders & changemakers", keywords: ["president", "leader", "king", "queen", "emperor", "general", "statesman", "activist", "politician"] },
  { id: "science", label: "Science & discovery", keywords: ["scientist", "inventor", "physicist", "chemist", "mathematician", "astronomer", "engineer", "doctor", "naturalist"] },
  { id: "ideas", label: "Thinkers & writers", keywords: ["philosopher", "writer", "author", "poet", "scholar", "theologian", "economist"] },
  { id: "arts", label: "Arts & culture", keywords: ["artist", "painter", "musician", "composer", "architect", "actor", "filmmaker"] },
];

export function FigureCollection({ figures = [], loading = false, loadError = false, initialSearch = "", onRetry }) {
  const [search, setSearch] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sort, setSort] = useState("collection");
  useEffect(() => setSearch(initialSearch), [initialSearch]);
  const visibleFigures = useMemo(() => {
    const term = search.trim().toLowerCase();
    const selected = filters.find(filter => filter.id === activeFilter);
    const matching = figures.map(normalizeFigure).filter(figure => {
      const text = figureText(figure);
      return (!term || text.includes(term)) && (activeFilter === "all" || selected.keywords.some(keyword => text.includes(keyword)));
    });
    return sort === "alphabetical" ? [...matching].sort((a, b) => a.name.localeCompare(b.name)) : matching;
  }, [activeFilter, figures, search, sort]);
  const clearFilters = () => { setSearch(""); setActiveFilter("all"); };
  return <main className="bd-directory collection-gallery">
    <header className="bd-header"><div className="bd-header-copy"><p className="bd-eyebrow">The portrait collection</p><h1>A different life.<br />A new perspective.</h1><p>Meet the people behind the history. Choose a figure, follow their story, and ask your own questions.</p></div><figure><img src="/images/page-figures-portraits.webp" alt="An expressive painting of portraits in a sunlit gallery" /><figcaption>Illustrative artwork · The collection</figcaption></figure></header>
    <section className="bd-controls" aria-label="Browse historical figures"><div className="collection-search-row"><label className="bd-search"><Search size={18} /><input value={search} onChange={event => setSearch(event.target.value)} aria-label="Search historical figures" placeholder="Find a name, an idea, an era…" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X /></button>}</label><label className="bd-sort"><span className="sr-only">Sort figures</span><select aria-label="Sort figures" value={sort} onChange={event => setSort(event.target.value)}><option value="collection">Collection order</option><option value="alphabetical">Name: A–Z</option></select></label></div><div className="bd-filters" aria-label="Filter by field">{filters.map(filter => <button type="button" key={filter.id} onClick={() => setActiveFilter(filter.id)} aria-pressed={activeFilter === filter.id} className={activeFilter === filter.id ? "is-active" : ""}>{filter.label}</button>)}</div></section>
    <section className="bd-results" aria-label="Historical figure collection"><div className="bd-results-heading"><p role="status">{loading ? "Opening the collection…" : loadError ? "The collection is temporarily unavailable" : `${visibleFigures.length} ${visibleFigures.length === 1 ? "life" : "lives"} to discover`}</p>{(search || activeFilter !== "all") && <button type="button" onClick={clearFilters}>Reset filters</button>}</div>
      {loading ? <div className="bd-grid" aria-hidden="true">{[1,2,3,4].map(item => <div className="bd-skeleton" key={item} />)}</div> : loadError ? <div className="bd-empty" role="alert"><h2>The collection couldn’t be loaded.</h2><p>Please try again in a moment.</p>{onRetry && <button type="button" onClick={onRetry}>Try again</button>}</div> : visibleFigures.length ? <div className="bd-grid">{visibleFigures.map(figure => <DirectoryFigureCard figure={figure} key={figure.id} />)}</div> : <div className="bd-empty"><Search /><h2>No lives found, yet.</h2><p>Try another name or explore a different field.</p><button type="button" onClick={clearFilters}>Show everyone</button></div>}
      <div className="collection-endnote"><p>Someone missing from the collection?</p><Link to="/create-new-bot">Suggest a historical figure <span aria-hidden="true">→</span></Link></div>
    </section>
  </main>;
}

export default function BotsDirectory() {
  const [figures, setFigures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    let active = true;
    setLoading(true); setLoadError(false);
    async function loadFigures() {
      try {
        if (!db) throw new Error("Archive not configured");
        const snapshot = await getDocs(collection(db, "bots"));
        if (active) setFigures(snapshot.docs.map(item => ({ ...item.data(), id: item.data().id || item.id })));
      } catch (error) {
        console.error("Error fetching figures:", error);
        if (active) setLoadError(true);
      } finally { if (active) setLoading(false); }
    }
    loadFigures();
    return () => { active = false; };
  }, [attempt]);
  return <FigureCollection figures={figures} loading={loading} loadError={loadError} initialSearch={searchParams.get("search") || ""} onRetry={() => setAttempt(value => value + 1)} />;
}
