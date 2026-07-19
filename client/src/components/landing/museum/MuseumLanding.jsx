import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock3,
  FileText,
  Landmark,
  MessageCircle,
  ScrollText,
  Scale,
  Users,
} from "lucide-react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase";
import MuseumFigureCard from "./MuseumFigureCard";
import "./museumLanding.css";

const discoveryPaths = [
  {
    id: "timeline",
    label: "Timeline",
    icon: Clock3,
    title: "Walk through a life, moment by moment.",
    description: "Move through turning points in order, then open any moment for the story behind the date.",
    eyebrow: "17 moments in chronological order",
    featureTitle: "Siege of Boston ends",
    featureDate: "March 17, 1776",
    featureText: "The British evacuated Boston after Washington’s forces secured the heights above the city.",
    markers: ["1732 · Birth", "1754 · First command", "1776 · Boston", "1789 · Presidency"],
  },
  {
    id: "evidence",
    label: "Documents",
    icon: FileText,
    title: "Examine what the past left behind.",
    description: "Open letters, speeches, and records. Learn who created them, why they matter, and what they leave out.",
    eyebrow: "Artifact desk · Primary record",
    featureTitle: "Washington’s Farewell Address",
    featureDate: "September 19, 1796",
    featureText: "Study the address as evidence: its intended audience, political purpose, and influence on the young republic.",
    markers: ["Authorship", "Historical setting", "Why it matters", "Limits of the source"],
  },
  {
    id: "ideas",
    label: "Ideas & debates",
    icon: Scale,
    title: "Investigate beliefs, choices, and contradictions.",
    description: "Compare interpretations, follow an idea over time, and decide which claims deserve closer examination.",
    eyebrow: "Idea lens · Competing interpretations",
    featureTitle: "Power and civic restraint",
    featureDate: "An idea across a lifetime",
    featureText: "Explore how Washington’s public ideals interacted with ambition, precedent, and the unresolved contradictions of his era.",
    markers: ["Central belief", "How it changed", "A contradiction", "Historian’s question"],
  },
  {
    id: "people",
    label: "People & world",
    icon: Users,
    title: "See the forces surrounding one person.",
    description: "Meet allies and rivals, enter the historical setting, and trace consequences beyond a single biography.",
    eyebrow: "People index · Historical setting",
    featureTitle: "A revolution shaped by many lives",
    featureDate: "Virginia · The thirteen colonies",
    featureText: "Connect a familiar name to the people, conflicts, institutions, and conditions that made their choices possible.",
    markers: ["Allies", "Rivals", "World around them", "Lasting impact"],
  },
];

const fallbackPortraits = [
  "/images/georgewashington-nobg.png",
  "/images/gandhi-nobg.png",
];

function MuseumLanding() {
  const navigate = useNavigate();
  const [figures, setFigures] = useState([]);
  const [loadingFigures, setLoadingFigures] = useState(true);
  const [activePath, setActivePath] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadFigures() {
      try {
        const snapshot = await getDocs(query(collection(db, "bots")));
        if (active) {
          setFigures(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        }
      } catch (error) {
        console.error("Unable to load the historical collection:", error);
      } finally {
        if (active) setLoadingFigures(false);
      }
    }

    loadFigures();
    return () => {
      active = false;
    };
  }, []);

  const featuredFigures = useMemo(() => figures.slice(0, 6), [figures]);
  const selectedPath = discoveryPaths[activePath];

  return (
    <main className="museum-landing">
      <section className="museum-hero" aria-labelledby="museum-hero-title">
        <div className="museum-paper-grain" />
        <div className="museum-hero-index" aria-hidden="true">
          <span>EST. MMXXIV</span>
          <span>INTERACTIVE COLLECTION / 01</span>
        </div>

        <div className="museum-hero-copy">
          <p className="museum-kicker">An interactive museum of lives and ideas</p>
          <h1 id="museum-hero-title">
            Don’t just read history.
            <em>Step inside it.</em>
          </h1>
          <p className="museum-hero-intro">
            Explore a life through its defining moments, people, ideas, and
            surviving evidence—then write directly to the person at its center.
          </p>
          <div className="museum-hero-actions">
            <button type="button" onClick={() => navigate("/signup")}>
              Enter the collection <ArrowRight />
            </button>
            <button type="button" className="museum-text-link" onClick={() => navigate("/bots")}>
              Browse every figure <ArrowUpRight />
            </button>
          </div>
          <div className="museum-hero-features" aria-label="Available experiences">
            <span><Clock3 /> Timelines</span>
            <span><FileText /> Documents</span>
            <span><Scale /> Debates</span>
            <span><MessageCircle /> Letters</span>
          </div>
        </div>

        <div className="museum-hero-art" aria-label="Portraits from the collection">
          <div className="museum-portrait museum-portrait-primary">
            <span>PLATE I</span>
            <img src={fallbackPortraits[0]} alt="George Washington" />
            <p>George Washington · 1732–1799</p>
          </div>
          <div className="museum-portrait museum-portrait-secondary">
            <span>PLATE II</span>
            <img src={fallbackPortraits[1]} alt="Mahatma Gandhi" />
          </div>
          <div className="museum-portrait museum-portrait-tertiary">
            <img src="/images/art6.png" alt="Geometric archival composition in black and ochre" />
          </div>
          <div className="museum-map-lines" aria-hidden="true" />
        </div>

        <div className="museum-scroll-cue" aria-hidden="true">
          <span />
          Scroll to begin
        </div>
      </section>

      <section className="museum-manifesto">
        <p className="museum-section-number">01 / THE PREMISE</p>
        <blockquote>
          A name is only the beginning.
          <br />Follow the life <em>behind it.</em>
        </blockquote>
        <div className="museum-manifesto-note">
          <p>
            Echoes of History brings biography, chronology, historical context,
            evidence, and correspondence into one guided experience. Start with
            what interests you and reveal more only when you are ready.
          </p>
          <figure>
            <img src="/images/art1.png" alt="Illustrated portrait of Socrates with a quotation about wisdom" />
            <figcaption>Study I · On wisdom and inquiry</figcaption>
          </figure>
        </div>
      </section>

      <section className="museum-paths" aria-labelledby="paths-title">
        <div className="museum-paths-heading">
          <div>
            <p className="museum-section-number">02 / INSIDE EVERY LIFE</p>
            <h2 id="paths-title">Choose how you want to explore.</h2>
          </div>
          <p>
            No crowded dashboard and no required order. Begin with a timeline,
            a document, an idea, or a person. Each path leads naturally to the next.
          </p>
        </div>

        <div className="museum-paths-stage">
          <nav className="museum-path-list" aria-label="Preview ways to explore history">
            {discoveryPaths.map((path, index) => {
              const Icon = path.icon;
              return (
                <button
                  type="button"
                  key={path.id}
                  className={activePath === index ? "is-active" : ""}
                  onClick={() => setActivePath(index)}
                  aria-pressed={activePath === index}
                >
                  <span className="museum-path-icon"><Icon aria-hidden="true" /></span>
                  <span>
                    <strong>{path.label}</strong>
                    <small>{path.title}</small>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </button>
              );
            })}
          </nav>

          <div className="museum-experience-preview" aria-live="polite">
            <header>
              <div>
                <span>George Washington</span>
                <strong>Explore history</strong>
              </div>
              <span className="museum-preview-status">Guided experience</span>
            </header>

            <div className="museum-preview-body">
              <div className="museum-preview-copy">
                <p>{selectedPath.eyebrow}</p>
                <h3>{selectedPath.title}</h3>
                <span>{selectedPath.description}</span>
              </div>

              <div className="museum-preview-card" key={selectedPath.id}>
                <span className="museum-preview-number">0{activePath + 1}</span>
                <p>{selectedPath.featureDate}</p>
                <h4>{selectedPath.featureTitle}</h4>
                <span>{selectedPath.featureText}</span>
                <div className="museum-preview-tags">
                  {selectedPath.markers.map((marker, markerIndex) => (
                    <span key={marker} className={markerIndex === 2 ? "is-current" : ""}>
                      {marker}
                    </span>
                  ))}
                </div>
              </div>

              <div className="museum-preview-correspondence">
                <MessageCircle aria-hidden="true" />
                <span>
                  <strong>Turn discovery into a question</strong>
                  <small>Write about any moment, source, person, or idea you uncover.</small>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="museum-paths-cta" onClick={() => navigate("/signup")}>
          Open an interactive life <ArrowRight />
        </button>
      </section>

      <section className="museum-collection" aria-labelledby="collection-title">
        <div className="museum-collection-heading">
          <div>
            <p className="museum-section-number">03 / THE COLLECTION</p>
            <h2 id="collection-title">Many lives.<br />Many ways into history.</h2>
          </div>
          <div>
            <p>
              Every figure opens into a guided historical world: a life story,
              chronological moments, relationships, evidence, debates, and a
              place to ask your own questions.
            </p>
            <button type="button" onClick={() => navigate("/bots")}>
              View the complete collection <ArrowRight />
            </button>
          </div>
        </div>

        <div className="museum-figure-grid">
          {loadingFigures
            ? Array.from({ length: 6 }, (_, index) => (
                <div className="museum-figure-skeleton" key={index} />
              ))
            : featuredFigures.map((figure, index) => (
                <MuseumFigureCard figure={figure} index={index} key={figure.id} />
              ))}
        </div>

        {!loadingFigures && featuredFigures.length === 0 && (
          <div className="museum-empty-collection">
            <ScrollText />
            <p>The collection is being prepared. Please return shortly.</p>
          </div>
        )}
      </section>

      <section className="museum-interlude">
        <div className="museum-interlude-mark" aria-hidden="true">“</div>
        <p>The past is a foreign country; they do things differently there.</p>
        <span>L. P. Hartley · The Go-Between · 1953</span>
      </section>

      <section className="museum-method" aria-labelledby="method-title">
        <div className="museum-method-intro">
          <p className="museum-section-number">04 / HOW IT WORKS</p>
          <h2 id="method-title">Learn by following your curiosity.</h2>
        </div>
        <div className="museum-method-grid">
          {[
            {
              icon: <Landmark />,
              number: "I",
              title: "Enter the world",
              text: "Start with a clear portrait of the person, their era, and the forces shaping the choices ahead of them.",
            },
            {
              icon: <BookOpen />,
              number: "II",
              title: "Follow what interests you",
              text: "Open a moment, idea, relationship, debate, or document. Each experience adapts to the records available.",
            },
            {
              icon: <MessageCircle />,
              number: "III",
              title: "Write across time",
              text: "Turn something you discovered into a focused letter. Ask for a defense, explanation, memory, or perspective.",
            },
          ].map((item) => (
            <article key={item.number}>
              <div className="museum-method-icon">{item.icon}</div>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="museum-reading-room">
        <div className="museum-reading-copy">
          <p className="museum-section-number">05 / FROM THE READING ROOM</p>
          <h2>History rewards the second question.</h2>
          <p>
            Continue beyond an individual life with essays on people, events,
            evidence, and the complicated ideas they left behind.
          </p>
          <button type="button" onClick={() => navigate("/articles")}>
            Enter the reading room <ArrowRight />
          </button>
        </div>
        <div className="museum-document-stack" aria-hidden="true">
          <div className="museum-document museum-document-back">
            <span>ARCHIVE / NOTES</span>
            <img className="museum-document-art" src="/images/art5.png" alt="" />
          </div>
          <div className="museum-document museum-document-front">
            <span>FIELD RECORD · NO. 17</span>
            <strong>To understand an age,<br />listen for its arguments.</strong>
            <div className="museum-document-lines" />
            <small>ECHOES OF HISTORY · READING ROOM</small>
          </div>
        </div>
      </section>

      <section className="museum-closing">
        <img src="/images/art2.png" alt="" aria-hidden="true" />
        <div>
          <p className="museum-section-number">THE ARCHIVE IS OPEN</p>
          <h2>There is more than one<br />way into the past.</h2>
          <button type="button" onClick={() => navigate("/signup")}>
            Begin your visit <ArrowRight />
          </button>
        </div>
      </section>

      <footer className="museum-footer">
        <div className="museum-footer-brand">
          <img src="/images/logoTransparent.png" alt="" />
          <div><strong>Echoes</strong><span>of history</span></div>
        </div>
        <div className="museum-footer-links">
          <div><span>Explore</span><button onClick={() => navigate("/bots")}>Collection</button><button onClick={() => navigate("/articles")}>Articles</button><button onClick={() => navigate("/about")}>About</button></div>
          <div><span>Visit</span><button onClick={() => navigate("/login")}>Member login</button><button onClick={() => navigate("/signup")}>Join the archive</button><button onClick={() => navigate("/feedback")}>Contact</button></div>
          <div><span>Legal</span><button onClick={() => navigate("/privacy")}>Privacy</button><button onClick={() => navigate("/terms")}>Terms</button><button onClick={() => navigate("/sitemap")}>Sitemap</button></div>
        </div>
        <p className="museum-footer-note">
          © {new Date().getFullYear()} Echoes of History. An interpretive digital collection.
        </p>
      </footer>
    </main>
  );
}

export default MuseumLanding;
