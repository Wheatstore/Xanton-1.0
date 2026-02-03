import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function SitemapPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "64px 24px" }}>
      <Helmet>
        <title>Sitemap | Echoes of History AI</title>
        <meta
          name="description"
          content="A complete sitemap of all public pages on Echoes of History AI."
        />
        <link rel="canonical" href="https://echoesofhistoryai.org/sitemap" />
      </Helmet>

      <h1>Sitemap</h1>
      <p>
        This page provides an overview of all publicly accessible pages on
        Echoes of History AI.
      </p>

      <section>
        <h2>Core Pages</h2>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/bots">Historical Figures</Link></li>
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/team">Team</Link></li>
        </ul>
      </section>

      <section>
        <h2>Trust & Legal</h2>
        <ul>
          <li><Link to="/privacy">Privacy Policy</Link></li>
          <li><Link to="/terms">Terms of Service</Link></li>
        </ul>
      </section>

      <section>
        <h2>Community</h2>
        <ul>
          <li><Link to="/feedback">Feedback</Link></li>
        </ul>
      </section>

      <section>
        <h2>Looking for bots?</h2>
        <p>
          Visit the <Link to="/bots">Historical Figures directory</Link> to
          explore and chat with available characters.
        </p>
      </section>
    </main>
  );
}
