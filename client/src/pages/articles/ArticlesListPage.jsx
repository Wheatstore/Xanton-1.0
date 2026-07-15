import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowUpRight, Search } from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../components/navbar/navbar";
import { MuseumFooter, MuseumPageHero } from "../../components/museum/MuseumPage";

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadArticles() {
      try {
        const snap = await getDocs(query(collection(db, "articles"), orderBy("title", "asc")));
        setArticles(snap.docs.map((item) => {
          const data = item.data() || {};
          return { id:item.id, slug:data.slug ?? item.id, title:data.title ?? "Untitled", author:data.author ?? "Unknown", excerpt:data.excerpt ?? "", category:data.category ?? "Essay", readTime:data.readTime ?? "", date:data.date ?? "", coverImage:data.coverImage ?? data.image ?? "" };
        }));
        setStatus("ready");
      } catch (error) {
        console.error("Error fetching articles:", error);
        setStatus("error");
      }
    }
    loadArticles();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return articles;
    return articles.filter((article) => [article.title,article.author,article.excerpt,article.category].join(" ").toLowerCase().includes(term));
  }, [articles, search]);

  return (
    <div className="mp-page">
      <Helmet><title>Reading Room | Echoes of History</title><meta name="description" content="Essays, stories, and historical interpretation from Echoes of History."/><link rel="canonical" href="https://echoesofhistoryai.org/articles" /></Helmet>
      <Navbar />
      <MuseumPageHero index="01" eyebrow="THE READING ROOM" title="History rewards" italic="the second question." description="Essays and stories for readers who want to move past the familiar account and stay with the difficult, human details." image="/images/art5.png" imageAlt="Archival illustration of a writing quill over handwritten text">
        <label className="article-search"><Search/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the reading room"/><span>{filtered.length}</span></label>
      </MuseumPageHero>
      <main className="mp-section mp-section-light">
        <div className="article-index-heading"><p className="mp-index">CATALOG / {String(filtered.length).padStart(2,"0")} RECORDS</p><p>Collected writing on people, movements, ideas, and the contested ways history is remembered.</p></div>
        {status === "loading" && <div className="article-grid">{[1,2,3,4,5,6].map(item => <div className="article-skeleton" key={item}/>)}</div>}
        {status === "error" && <div className="mp-state"><h2>The reading room is temporarily closed.</h2><p>Please return once the archive connection has been restored.</p></div>}
        {status === "ready" && filtered.length === 0 && <div className="mp-state"><h2>No record matches that search.</h2><p>Try a broader subject, author, or title.</p></div>}
        {status === "ready" && filtered.length > 0 && <div className="article-grid">
          {filtered.map((article,index) => <Link className="article-card" to={`/articles/${encodeURIComponent(article.slug)}`} key={article.id}>
            <div className="article-cover">{article.coverImage ? <img src={article.coverImage} alt="" loading="lazy"/> : <div className="article-placeholder"><span>EOH</span></div>}<span>PLATE {String(index+1).padStart(2,"0")}</span></div>
            <div className="article-caption"><p>{article.category} {article.readTime && `· ${article.readTime}`}</p><h2>{article.title}</h2><p>{article.excerpt || "Open this record to continue reading."}</p><div><span>{article.author}{article.date && ` · ${article.date}`}</span><ArrowUpRight/></div></div>
          </Link>)}
        </div>}
      </main>
      <MuseumFooter />
    </div>
  );
}
