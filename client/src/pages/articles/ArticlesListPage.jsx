import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
        if (!db) { setStatus("error"); return; }
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

      <Navbar />
      <MuseumPageHero index="01" eyebrow="THE READING ROOM" title="There’s always" italic="more to the story." description="Stories, ideas, and perspectives to keep your curiosity going beyond the conversation." image="/images/page-articles-desk.webp" imageAlt="An open book and handwritten pages on a sunlit writer’s desk">
        <label className="article-search"><Search/><input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search articles" placeholder="Search stories, people, or ideas"/><span>{filtered.length}</span></label>
      </MuseumPageHero>
      <main className="mp-section mp-section-light">
        <div className="article-index-heading"><p className="mp-index">CATALOG / {String(filtered.length).padStart(2,"0")} RECORDS</p><p>Collected writing on people, movements, ideas, and the contested ways history is remembered.</p></div>
        {status === "loading" && <div className="article-grid">{[1,2,3,4,5,6].map(item => <div className="article-skeleton" key={item}/>)}</div>}
        {status === "error" && <div className="mp-state"><h2>The articles are taking a little longer.</h2><p>We couldn’t connect to the reading room. Please try again later.</p></div>}
        {status === "ready" && filtered.length === 0 && <div className="mp-state"><h2>No record matches that search.</h2><p>Try a broader subject, author, or title.</p></div>}
        {status === "ready" && filtered.length > 0 && <div className="article-grid">
          {filtered.map((article,index) => <Link className="article-card" to={`/articles/${encodeURIComponent(article.slug)}`} key={article.id}>
            <div className="article-cover">{article.coverImage ? <img src={article.coverImage} alt="" loading="lazy"/> : <img src={["/images/page-features-cabinet.webp","/images/page-about-gallery.webp","/images/page-discovery-flowers.webp"][index % 3]} alt="" loading="lazy"/>}<span>PLATE {String(index+1).padStart(2,"0")}</span></div>
            <div className="article-caption"><p>{article.category} {article.readTime && `· ${article.readTime}`}</p><h2>{article.title}</h2><p>{article.excerpt || "Open this record to continue reading."}</p><div><span>{article.author}{article.date && ` · ${article.date}`}</span><ArrowUpRight/></div></div>
          </Link>)}
        </div>}
      </main>
      <MuseumFooter />
    </div>
  );
}
