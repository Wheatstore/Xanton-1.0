/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./museumPage.css";

export function MuseumPageHero({ index, eyebrow, title, italic, description, image, imageAlt = "", children }) {
  return (
    <header className="mp-hero">
      <div className="mp-hero-copy">
        <p className="mp-index">{index} / {eyebrow}</p>
        <h1>{title}{italic && <em>{italic}</em>}</h1>
        {description && <p className="mp-deck">{description}</p>}
        {children}
      </div>
      <div className={`mp-hero-art ${image?.includes("/art") ? "mp-hero-artwork" : ""}`} aria-hidden={!image}>
        <span>{image?.includes("/art") ? "COLLECTION STUDY · EOH" : "ARCHIVE PLATE · EOH"}</span>
        {image ? <img src={image} alt={imageAlt} /> : <div className="mp-line-art" />}
      </div>
    </header>
  );
}

export function MuseumFooter() {
  const navigate = useNavigate();
  return (
    <footer className="mp-footer">
      <div className="mp-footer-brand">
        <img src="/images/logoTransparent.png" alt="" />
        <p><strong>Echoes</strong><span>of history</span></p>
      </div>
      <div className="mp-footer-links">
        {[['Collection','/bots'],['Articles','/articles'],['About','/about'],['Partners','/partners'],['Privacy','/privacy'],['Terms','/terms']].map(([label,path]) => (
          <button type="button" key={path} onClick={() => navigate(path)}>{label}</button>
        ))}
      </div>
      <p>© {new Date().getFullYear()} Echoes of History · An interpretive digital collection</p>
    </footer>
  );
}

export function MuseumCTA({ eyebrow = "THE ARCHIVE IS OPEN", title = "Continue your visit.", action = "Enter the collection", path = "/signup" }) {
  const navigate = useNavigate();
  return (
    <section className="mp-cta">
      <p className="mp-index">{eyebrow}</p>
      <h2>{title}</h2>
      <button type="button" className="mp-button" onClick={() => navigate(path)}>{action}<ArrowRight /></button>
    </section>
  );
}
