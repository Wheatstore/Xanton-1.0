import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../components/navbar/navbar";
import { MuseumFooter } from "../../components/museum/MuseumPage";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    setArticle(null);
    setStatus("loading");
    async function loadArticle() {
      if (!slug) { setStatus("not_found"); return; }
      try {
        if (!db) { setStatus("error"); return; }
        const snap = await getDoc(doc(db,"articles",slug));
        if (!active) return;
        if (!snap.exists()) { setStatus("not_found"); return; }
        const data = snap.data() || {};
        setArticle({ id:snap.id, title:data.title ?? "Untitled", author:data.author ?? "Unknown", date:data.date ?? "", category:data.category ?? "Essay", readTime:data.readTime ?? "", excerpt:data.excerpt ?? "", coverImage:data.coverImage ?? data.image ?? "", content:data.content ?? "" });
        setStatus("ready");
      } catch (error) { if (!active) return; console.error("Error fetching article:",error); setStatus("error"); }
    }
    loadArticle();
    return () => { active = false; };
  }, [slug]);

  const paragraphs = useMemo(() => (article?.content ?? "").split(/\n{2,}/g).map(item => item.trim()).filter(Boolean),[article]);
  const canonical = `https://echoesofhistoryai.org/articles/${slug || ""}`;

  return <div className="mp-page">
    <Navbar />
    <Helmet>
      <title>{article ? `${article.title} | Echoes of History` : "Article | Echoes of History"}</title>
      <meta name="description" content={article?.excerpt || "Read from the Echoes of History archive."} />
      <meta name="robots" content={status === "not_found" || status === "error" ? "noindex, follow" : "index, follow, max-image-preview:large"} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={article?.title || "History Article | Echoes of History"} />
      <meta property="og:description" content={article?.excerpt || "Read from the Echoes of History archive."} />
      <meta property="og:image" content={article?.coverImage || "https://echoesofhistoryai.org/images/og-image.jpg"} />
      <meta name="twitter:title" content={article?.title || "History Article | Echoes of History"} />
      <meta name="twitter:description" content={article?.excerpt || "Read from the Echoes of History archive."} />
      <meta name="twitter:image" content={article?.coverImage || "https://echoesofhistoryai.org/images/og-image.jpg"} />
      {article && <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.excerpt, mainEntityOfPage: canonical, author: { "@type": "Person", name: article.author }, ...(article.coverImage ? { image: article.coverImage } : {}) }).replaceAll("<", "\\u003c")}</script>}
    </Helmet>
    {status === "loading" && <main className="mp-state"><p className="mp-index">OPENING RECORD</p><h2>Preparing the article…</h2></main>}
    {(status === "error" || status === "not_found") && <main className="mp-state"><p className="mp-index">ARCHIVE NOTICE</p><h2>{status === "not_found" ? "This record could not be found." : "This record could not be opened."}</h2><Link className="mp-text-button" to="/articles"><ArrowLeft/>Return to the reading room</Link></main>}
    {status === "ready" && <main className="article-page">
      <header className="article-masthead">
        <Link to="/articles"><ArrowLeft/>Reading room</Link>
        <div className="article-masthead-grid"><div><p className="mp-index">{article.category} / ARCHIVE ESSAY</p><h1>{article.title}</h1><p className="article-excerpt">{article.excerpt}</p><div className="article-byline"><span>By {article.author}</span><span>{article.date}</span><span>{article.readTime}</span></div></div>
        <figure><img src={article.coverImage || "/images/page-articles-desk.webp"} alt=""/><figcaption>{article.coverImage ? "Image from the article record" : "Illustrative artwork · Echoes of History"}</figcaption></figure></div>
      </header>
      <div className="article-body-layout"><aside><p className="mp-index">RECORD DETAILS</p><dl><dt>Author</dt><dd>{article.author}</dd><dt>Published</dt><dd>{article.date || "Undated"}</dd><dt>Section</dt><dd>{article.category}</dd></dl></aside><article className="article-prose">{paragraphs.length ? paragraphs.map((paragraph,index) => <p className={index === 0 ? "article-lede" : ""} key={index}>{paragraph}</p>) : <p className="article-lede">This article has not yet been transcribed into the digital record.</p>}</article></div>
    </main>}
    <MuseumFooter />
  </div>;
}
