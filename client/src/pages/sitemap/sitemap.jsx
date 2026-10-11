import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../../components/navbar/navbar";
import { MuseumPageHero, MuseumFooter } from "../../components/museum/MuseumPage";
const groups = [
  { title: "Explore", links: [["Home","/","A place to begin"],["Our Figures","/bots","Meet the people behind the dates"],["Features","/features","See how Echoes works"],["Articles","/articles","Find your next good read"]] },
  { title: "Get to know us", links: [["About","/about","The idea behind Echoes"],["Partners","/partners","Bring history to your community"],["Feedback","/feedback","Help shape the experience"]] },
  { title: "Your account & privacy", links: [["Log in","/login","Continue a conversation"],["Sign up","/signup","Begin a new chapter"],["Privacy Policy","/privacy","How your information is handled"],["Terms of Service","/terms","The terms for using Echoes"]] },
];
export default function SitemapPage() { return <div className="mp-page"><Navbar/><MuseumPageHero eyebrow="FIND YOUR WAY" title="A map of" italic="Echoes of History." description="Choose a path. There’s something to discover around every corner." image="/images/page-sitemap-atlas.webp" imageAlt="An artist’s interpretation of a maritime atlas with a compass rose and sailing ships"/><main className="mp-section sitemap-grid">{groups.map(group => <section key={group.title}><h2>{group.title}</h2>{group.links.map(([title,path,description]) => <Link key={path} to={path}><span><strong>{title}</strong><small>{description}</small></span><ArrowUpRight size={16}/></Link>)}</section>)}</main><MuseumFooter/></div>; }
