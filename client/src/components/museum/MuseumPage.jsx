/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ArchiveBrand } from "../navbar/navbar";
import "./museumPage.css";

export function MuseumPageHero({ eyebrow, title, italic, description, image = "/images/page-feedback-letters.webp", imageAlt = "", children }) {
  return <header className="mp-hero">
    <div className="mp-hero-copy"><p className="mp-index">{eyebrow}</p><h1>{title}{italic && " "}{italic && <em>{italic}</em>}</h1>{description && <p className="mp-deck">{description}</p>}{children}</div>
    <figure className="mp-hero-art"><img src={image} alt={imageAlt}/><figcaption>Illustrative artwork · Echoes of History</figcaption></figure>
  </header>;
}
export function MuseumFooter() {
  return <footer className="mp-footer"><Link to="/" aria-label="Echoes of History home"><ArchiveBrand/></Link><div className="mp-footer-links">{[['About','/about'],['Feedback','/feedback'],['Privacy','/privacy'],['Terms','/terms'],['Sitemap','/sitemap']].map(([label,path]) => <Link key={path} to={path}>{label}</Link>)}</div><p>© {new Date().getFullYear()} Echoes of History. AI conversations are interpretations; verify important facts with trusted sources.</p></footer>;
}
export function MuseumCTA({ eyebrow = "FOLLOW YOUR CURIOSITY", title = "History is a conversation away.", action = "Explore the figures", path = "/bots" }) {
  return <section className="mp-cta"><div><p className="mp-index">{eyebrow}</p><h2>{title}</h2><Link className="mp-button" to={path}>{action}<ArrowRight size={17}/></Link></div><img src="/images/page-discovery-flowers.webp" alt="Cream wildflowers and terracotta poppies painted against a deep blue background" loading="lazy"/></section>;
}
