import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import MuseumLanding from "../../components/landing/museum/MuseumLanding";
import "./landing.css";

const links = [["Features", "/features"], ["About", "/about"], ["Our Figures", "/bots"], ["Partners", "/partners"], ["Articles", "/articles"]];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        document.getElementById("echo-menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuOpen]);
  return (
    <div className="landing-page-container">
      <header className={`echo-nav${menuOpen ? " menu-open" : ""}`}>
        <div className="echo-nav-inner">
          <Link className="echo-brand" to="/" aria-label="Echoes of History home"><span className="echo-logo-crop"><img src="/logoTransparent.png" alt="" width="500" height="500" /></span><span>Echoes<span>OF HISTORY</span></span></Link>
          <nav className="echo-nav-links" aria-label="Main navigation">{links.map(([label, path]) => <Link key={path} to={path}>{label}</Link>)}<Link className="echo-login" to="/login">Log in</Link><Link className="echo-signup" to="/signup">Sign up <FiArrowRight /></Link></nav>
          <button className="echo-menu-toggle" id="echo-menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="echo-mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <FiX size={23} /> : <FiMenu size={23} />}</button>
        </div>
        {menuOpen && <nav id="echo-mobile-nav" className="echo-mobile-nav" aria-label="Mobile navigation">{[...links, ["Log in", "/login"], ["Create an account", "/signup"]].map(([label, path]) => <Link key={path} to={path}>{label}<FiArrowRight size={16} /></Link>)}</nav>}
      </header>
      <MuseumLanding />
      <footer className="echo-footer">
        <Link className="echo-brand" to="/" aria-label="Echoes of History home"><span className="echo-logo-crop"><img src="/logoTransparent.png" alt="" width="500" height="500" /></span><span>Echoes<span>OF HISTORY</span></span></Link>
        <nav aria-label="Footer navigation"><Link to="/about">About</Link><Link to="/feedback">Contact</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></nav>
      </footer>
    </div>
  );
}
