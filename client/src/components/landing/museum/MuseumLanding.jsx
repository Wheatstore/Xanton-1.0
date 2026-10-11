import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiClock, FiFileText, FiMessageCircle, FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import { GoLaw } from "react-icons/go";
import "./museumLanding.css";

const discoveryPaths = [
  { label: "Timeline", icon: FiClock, eyebrow: "A life in context", title: "Walk through a life, moment by moment.", description: "Follow the turning points that shaped a person. Connect the dates to the decisions, and the person to the world around them.", heading: "A revolution takes shape.", text: "As commander of the Continental Army, George Washington faced a question larger than any battlefield: could thirteen colonies become a nation?", topics: ["1732 · Early life", "1776 · Revolution", "1789 · Presidency", "1796 · Farewell"] },
  { label: "Documents", icon: FiFileText, eyebrow: "Look closer at the evidence", title: "Examine what the past left behind.", description: "Explore letters, speeches, and records. Consider who created them, who they were for, and what their words reveal—or leave unsaid.", heading: "Washington’s Farewell Address", text: "Read the address in the context of a young republic. Consider its audience, political purpose, and the concerns Washington chose to leave with the nation.", topics: ["The author", "The audience", "The context", "The interpretation"] },
  { label: "Ideas & debates", icon: GoLaw, eyebrow: "Make room for complexity", title: "Great lives. Difficult questions.", description: "Explore beliefs, choices, and contradictions. Compare interpretations and consider what the evidence can tell us.", heading: "What should power look like?", text: "Explore Washington’s public commitment to civic restraint alongside the contradictions of his life and the institutions of his era.", topics: ["Public ideals", "Private choices", "Contradictions", "Lasting influence"] },
  { label: "People & world", icon: FiUsers, eyebrow: "A person in their world", title: "No life happens in isolation.", description: "Meet allies and rivals, explore the historical setting, and trace connections beyond a single biography.", heading: "A revolution shaped by many lives", text: "Connect Washington’s story to the people, conflicts, and conditions around him. Discover how one life fits into a much larger history.", topics: ["Allies", "Rivals", "Historical setting", "Lasting impact"] },
];

const previewArtwork = [
  { image: "home-world-map.webp", alt: "Illustrative antique-style map with intricate coastlines and a compass rose" },
  { image: "home-notebook.webp", alt: "Illustrated handwritten field notes on aged parchment" },
  { image: "home-manuscript.webp", alt: "Illustrated illuminated manuscript with a scholar reading" },
  { image: "home-street.webp", alt: "Illustrative archival-style scene of everyday life on a cobblestone street" },
];

const figures = [
  { name: "George Washington", dates: "1732–1799", category: "Leadership & revolution", image: "washington-480.webp", description: "Explore the person behind the presidency.", tone: "stone" },
  { name: "Mahatma Gandhi", dates: "1869–1948", category: "Ideas & social change", image: "gandhi-480.webp", description: "Examine a life shaped by nonviolent resistance.", tone: "sage" },
  { name: "Martin Luther King Jr.", dates: "1929–1968", category: "Civil rights & justice", image: "mlk-480.webp", description: "Meet a voice that helped move a movement.", tone: "clay" },
];

const questions = [
  ["What is Echoes of History?", "Echoes of History is an interactive history platform. Explore historical figures through biographies, timelines, documents, ideas, and AI-powered conversations."],
  ["Am I talking to a real historical figure?", "No. Conversations are AI-generated interpretations, not authentic statements or primary sources. Responses can contain mistakes. Use them to spark curiosity, and check important claims against reliable historical sources."],
  ["How do I get started?", "Browse Our Figures to find someone who interests you. Create an account to explore their life and start a conversation. You can also read historical stories in Articles."],
];

export default function MuseumLanding() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activePath, setActivePath] = useState(0);
  const selected = discoveryPaths[activePath];
  const artwork = previewArtwork[activePath];

  return (
    <main className="archive-home" id="main-content" tabIndex={-1}>
      <section className="archive-hero" aria-labelledby="hero-title">
        <img className="archive-hero-art" src="/images/home-landscape.webp" alt="An oil-painted Mediterranean landscape with an olive tree, a lake, and a distant hilltop village" width="1920" height="1080" loading="eager" />
        <div className="archive-hero-tint" />
        <div className="archive-hero-copy">
          <h1 id="hero-title">Don’t just read history.<br />Step inside it.</h1>
          <p>Explore the lives and ideas of historical figures.<br /> Then ask your own questions through AI-powered conversations.</p>
          <div className="history-hero-actions"><Link className="archive-primary" to="/bots">Explore our figures <FiArrowRight aria-hidden="true" /></Link><a className="history-hero-secondary" href="#experience">How it works</a></div>
        </div>
        <form className="archive-search" role="search" onSubmit={event => { event.preventDefault(); navigate(search.trim() ? `/bots?search=${encodeURIComponent(search.trim())}` : "/bots"); }}>
          <FiSearch size={21} aria-hidden="true" />
          <input aria-label="Search historical figures" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search a name, era, or idea…" />
          <button type="submit" aria-label="Search our figures"><FiArrowRight size={20} /></button>
        </form>
      </section>

      <section className="archive-experience archive-wrap" id="experience" aria-labelledby="experience-title">
        <div className="archive-heading"><div><p className="archive-eyebrow">The experience</p><h2 id="experience-title">Go beyond the dates.</h2></div><p>Follow a life. Explore the context.<br />Find your own way into the conversation.</p></div>
        <div className="history-explorer">
          <aside className="history-sidebar"><h3>One life.<br /> Many perspectives.</h3><div className="history-tabs" aria-label="Ways to explore a historical figure">{discoveryPaths.map(({label, icon:Icon}, index) => <button type="button" key={label} className={activePath === index ? "is-active" : ""} aria-pressed={activePath === index} aria-controls="history-preview" onClick={() => setActivePath(index)}><Icon size={19} aria-hidden="true" /><span>{label}</span></button>)}</div></aside>
          <div className="history-preview" id="history-preview" aria-live="polite">
            <div className="history-preview-heading"><p className="archive-eyebrow">{selected.eyebrow}</p><h3>{selected.title}</h3><p>{selected.description}</p></div>
            <div className="history-preview-body"><figure className="history-preview-art"><img src={`/images/${artwork.image}`} alt={artwork.alt} width="900" height="600" loading="lazy" /><figcaption>Illustrative artwork · {selected.label}</figcaption></figure><div className="history-preview-story"><p className="archive-eyebrow">George Washington · {selected.label}</p><h4>{selected.heading}</h4><p>{selected.text}</p><ul>{selected.topics.map(topic => <li key={topic}>{topic}</li>)}</ul><Link className="archive-inline-link" to="/bots?search=George%20Washington">Explore George Washington <FiArrowRight /></Link></div></div>
            <div className="history-preview-footer"><span><FiMessageCircle aria-hidden="true" /> Every life opens a conversation.</span><Link to="/features">See all features <FiArrowRight /></Link></div>
          </div>
        </div>
      </section>

      <section className="history-figures archive-wrap" id="collection" aria-labelledby="collection-title">
        <div className="archive-heading"><div><p className="archive-eyebrow">Our figures</p><h2 id="collection-title">Who would you like to meet?</h2></div><Link className="archive-view-all" to="/bots">View all figures <FiArrowRight /></Link></div>
        <div className="history-figure-grid">{figures.map(figure => <Link className={`history-figure history-figure-${figure.tone}`} key={figure.name} to={`/bots?search=${encodeURIComponent(figure.name)}`}><div className="history-figure-art"><span className="history-figure-category">{figure.category}</span><img src={`/images/${figure.image}`} alt={`Portrait of ${figure.name}`} width="480" height="600" loading="lazy" /><span className="history-figure-dates">{figure.dates}</span><FiArrowRight className="history-figure-arrow" aria-hidden="true" /></div><h3>{figure.name}</h3><p>{figure.description}</p></Link>)}</div>
      </section>

      <section className="history-conversation archive-wrap" aria-labelledby="conversation-title"><div><p className="archive-eyebrow">A conversation across time</p><h2 id="conversation-title">You bring the curiosity.<br />We’ll bring the past closer.</h2><p>Ask about a decision. Question an idea. Follow up on something unexpected. An AI interpretation of a historical figure gives you a new way to explore their life and world.</p><Link className="history-dark-button" to="/signup">Start your conversation <FiArrowRight /></Link><p className="history-ai-note">AI interpretations, not primary sources. Always an invitation to look deeper.</p></div><div className="history-conversation-art"><img src="/images/home-journal.webp" alt="Illustration of a handwritten journal with a coastal sketch" width="800" height="1000" loading="lazy" /><div><FiMessageCircle aria-hidden="true" /><p>“What shaped the way<br />you saw the world?”</p><span>Your next question is a beginning.</span></div></div></section>

      <section className="history-more archive-wrap" aria-label="More from Echoes">
        <Link to="/articles"><div className="history-editorial-art"><img src="/images/home-manuscript.webp" alt="An illustrated medieval manuscript with colorful floral ornament" width="1200" height="400" loading="lazy" /></div><div className="history-editorial-copy"><div><p className="archive-eyebrow">Articles</p><h3>Keep following the story.</h3><p>Read historical stories and perspectives for curious minds.</p></div><FiArrowRight aria-hidden="true" /></div></Link>
        <Link to="/partners"><div className="history-editorial-art"><img src="/images/home-street.webp" alt="An archival-style illustration of people on a historic city street" width="800" height="1000" loading="lazy" /></div><div className="history-editorial-copy"><div><p className="archive-eyebrow">Partners</p><h3>History is better shared.</h3><p>Explore opportunities to work with Echoes of History.</p></div><FiArrowRight aria-hidden="true" /></div></Link>
      </section>

      <section className="history-faq archive-wrap" aria-labelledby="faq-title"><div><p className="archive-eyebrow">Before you begin</p><h2 id="faq-title">A few good questions.</h2></div><div>{questions.map(([question,answer]) => <details key={question}><summary>{question}<FiPlus aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>
    </main>
  );
}
