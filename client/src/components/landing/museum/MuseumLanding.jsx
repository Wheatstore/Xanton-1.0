import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Quote,
  ScrollText,
} from "lucide-react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase";
import MuseumFigureCard from "./MuseumFigureCard";
import "./museumLanding.css";

const encounterPrompts = [
  {
    question: "What does courage demand of ordinary people?",
    answer:
      "Courage is not reserved for the remarkable. It begins when an ordinary person decides that conscience must be made visible through action.",
  },
  {
    question: "Which moment changed the course of your life?",
    answer:
      "A life is rarely altered by one moment alone. It is shaped by the instant when humiliation becomes resolve, and resolve becomes service.",
  },
  {
    question: "What would you ask of this generation?",
    answer:
      "Do not inherit the language of justice without accepting its obligations. Let conviction be measured by what you are willing to practice.",
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
  const [activePrompt, setActivePrompt] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadFigures() {
      try {
        const snapshot = await getDocs(query(collection(db, "bots")));
        if (active) {
          setFigures(
            snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
          );
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

  return (
    <main className="museum-landing">
      <section className="museum-hero" aria-labelledby="museum-hero-title">
        <div className="museum-paper-grain" />
        <div className="museum-hero-index" aria-hidden="true">
          <span>EST. MMXXIV</span>
          <span>DIGITAL COLLECTION / 01</span>
        </div>

        <div className="museum-hero-copy">
          <p className="museum-kicker">A living archive of human thought</p>
          <h1 id="museum-hero-title">
            History is not silent.
            <em>We simply stopped asking.</em>
          </h1>
          <p className="museum-hero-intro">
            Meet the people behind the dates. Enter a carefully framed
            conversation with the thinkers, leaders, artists, and dissenters
            who changed how we understand the world.
          </p>
          <div className="museum-hero-actions">
            <button type="button" onClick={() => navigate("/signup")}>
              Enter the collection <ArrowRight />
            </button>
            <button type="button" className="museum-text-link" onClick={() => navigate("/bots")}>
              Browse every figure <ArrowUpRight />
            </button>
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
          A date tells you <em>when.</em>
          <br />A conversation asks <em>why.</em>
        </blockquote>
        <div className="museum-manifesto-note">
          <p>Echoes of History is an interpretive space for curiosity. Biography,
          context, and conversation are brought together so the past feels
          human again—not flattened into a timeline.</p>
          <figure><img src="/images/art1.png" alt="Illustrated portrait of Socrates with a quotation about wisdom"/><figcaption>Study I · On wisdom and inquiry</figcaption></figure>
        </div>
      </section>

      <section className="museum-encounter" aria-labelledby="encounter-title">
        <div className="museum-encounter-portrait">
          <div className="museum-portrait-frame">
            <img src="/images/gandhi-nobg.png" alt="Mahatma Gandhi" />
          </div>
          <div className="museum-portrait-label">
            <span>On view now</span>
            <strong>Mahatma Gandhi</strong>
            <small>1869–1948 · Statesman and activist</small>
          </div>
        </div>

        <div className="museum-encounter-content">
          <p className="museum-section-number">02 / AN ENCOUNTER</p>
          <h2 id="encounter-title">Begin with a question that matters.</h2>
          <div className="museum-transcript" aria-live="polite">
            <div className="museum-transcript-meta">
              <span>Interpretive transcript</span>
              <span>Excerpt 01</span>
            </div>
            <Quote aria-hidden="true" />
            <p>{encounterPrompts[activePrompt].answer}</p>
            <small>— A response presented in the voice of Mahatma Gandhi</small>
          </div>
          <div className="museum-question-list">
            {encounterPrompts.map((prompt, index) => (
              <button
                type="button"
                key={prompt.question}
                className={activePrompt === index ? "is-active" : ""}
                onClick={() => setActivePrompt(index)}
              >
                <span>0{index + 1}</span>
                {prompt.question}
                <ArrowRight />
              </button>
            ))}
          </div>
          <button type="button" className="museum-primary-link" onClick={() => navigate("/signup")}>
            Continue the conversation <ArrowUpRight />
          </button>
          <p className="museum-disclaimer">
            Interpretive conversations may contain inaccuracies. Important
            claims should be checked against primary sources.
          </p>
        </div>
      </section>

      <section className="museum-collection" aria-labelledby="collection-title">
        <div className="museum-collection-heading">
          <div>
            <p className="museum-section-number">03 / THE COLLECTION</p>
            <h2 id="collection-title">Many lives.<br />Many ways into history.</h2>
          </div>
          <div>
            <p>
              Browse a changing selection from the archive. Every portrait is
              an invitation to ask about a decision, an era, or a life as it
              was actually lived.
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
        <p>
          The past is a foreign country; they do things differently there.
        </p>
        <span>L. P. Hartley · The Go-Between · 1953</span>
      </section>

      <section className="museum-method" aria-labelledby="method-title">
        <div className="museum-method-intro">
          <p className="museum-section-number">04 / HOW TO VISIT</p>
          <h2 id="method-title">Three ways to enter an era.</h2>
        </div>
        <div className="museum-method-grid">
          {[
            {
              icon: <Compass />,
              number: "I",
              title: "Choose a life",
              text: "Begin with the person who unsettles, inspires, or puzzles you. Curiosity is the only required map.",
            },
            {
              icon: <BookOpen />,
              number: "II",
              title: "Ask beyond the textbook",
              text: "Move past dates and titles. Ask about private doubts, difficult choices, rivals, and consequences.",
            },
            {
              icon: <ScrollText />,
              number: "III",
              title: "Return to the record",
              text: "Treat every exchange as a doorway. Follow it into biographies, documents, and primary sources.",
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
            Continue beyond the conversation with essays on people, events,
            and the complicated ideas they left behind.
          </p>
          <button type="button" onClick={() => navigate("/articles")}>
            Enter the reading room <ArrowRight />
          </button>
        </div>
        <div className="museum-document-stack" aria-hidden="true">
          <div className="museum-document museum-document-back">
            <span>ARCHIVE / NOTES</span>
            <img className="museum-document-art" src="/images/art5.png" alt="Illustration of a writing quill over manuscript" />
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
          <h2>The next question<br />belongs to you.</h2>
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
