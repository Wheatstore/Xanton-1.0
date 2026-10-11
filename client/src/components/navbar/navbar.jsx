import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import { useArchiveAuth } from "../../hooks/useArchiveAuth";
import { auth } from "../../firebase";
import { userSignOut } from "../../authenticationFunctions/signout";
import "../museum/museumPage.css";

const publicLinks = [["Features", "/features"], ["About", "/about"], ["Our Figures", "/bots"], ["Partners", "/partners"], ["Articles", "/articles"]];

export function ArchiveBrand() {
  return <span className="archive-brand"><span className="archive-logo"><img src="/logoTransparent.png" alt="" width="500" height="500" /></span><span>Echoes<small>OF HISTORY</small></span></span>;
}

export default function Navbar() {
  const [user] = useArchiveAuth(auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const toggleRef = useRef(null);
  const accountRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => { setMobileOpen(false); setAccountOpen(false); }, [location.pathname]);
  useEffect(() => {
    function close(event) {
      if (event.key === "Escape") {
        if (mobileOpen) toggleRef.current?.focus();
        if (accountOpen) accountRef.current?.focus();
        setMobileOpen(false); setAccountOpen(false);
      }
    }
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [mobileOpen, accountOpen]);
  async function signOut() { await userSignOut(); setAccountOpen(false); navigate("/"); }
  const accountLinks = <><Link to="/user">My collection</Link><Link to={`/profile/${encodeURIComponent(user?.displayName || "me")}`}>Profile</Link><Link to="/create-new-bot">Request a figure</Link><Link to="/feedback">Feedback</Link><button type="button" onClick={signOut}><LogOut size={15}/> Sign out</button></>;
  return <nav className="archive-navbar" aria-label="Main navigation">
    <div className="archive-nav-inner">
      <Link to="/" aria-label="Echoes of History home"><ArchiveBrand/></Link>
      <div className="archive-desktop-links">{publicLinks.map(([label,path]) => <NavLink key={path} to={path}>{label}</NavLink>)}</div>
      <div className="archive-account">
        {user ? <div className="archive-account-wrap"><button ref={accountRef} type="button" aria-expanded={accountOpen} aria-controls="archive-account-menu" onClick={() => setAccountOpen(!accountOpen)}><User size={16}/><span>{user.displayName || "Account"}</span><ChevronDown size={14}/></button>{accountOpen && <div id="archive-account-menu" className="archive-account-menu">{accountLinks}</div>}</div> : <><Link to="/login">Log in</Link><Link className="archive-signup" to="/signup">Sign up</Link></>}
      </div>
      <button ref={toggleRef} className="archive-menu-toggle" type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="archive-mobile-nav" aria-label={mobileOpen ? "Close navigation" : "Open navigation"}>{mobileOpen ? <X/> : <Menu/>}</button>
    </div>
    {mobileOpen && <div id="archive-mobile-nav" className="archive-mobile-links">{publicLinks.map(([label,path]) => <NavLink key={path} to={path}>{label}</NavLink>)}<div className="archive-mobile-account">{user ? accountLinks : <><Link to="/login">Log in</Link><Link to="/signup">Sign up <span>→</span></Link></>}</div></div>}
  </nav>;
}
