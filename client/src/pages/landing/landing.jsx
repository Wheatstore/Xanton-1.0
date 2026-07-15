import { Helmet } from "react-helmet";
import NavbarHome from "../../components/navbar/navbar";
import MuseumLanding from "../../components/landing/museum/MuseumLanding";
import "./landing.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function LandingPage() {
  const [, loading] = useAuthState(auth);
  if (loading) return null;

  return (
    <>
        <Helmet>
          <title>Echoes of History — Conversations with the Past</title>
          <meta
            name="description"
            content="Enter a living digital museum of historical figures, ideas, and conversations. Discover the people behind the dates and ask the past a deeper question."
          />
          <meta name="robots" content="index, follow" />

          {/* Canonical MUST match final URL exactly (note trailing slash) */}
          <link rel="canonical" href="https://echoesofhistoryai.org/" />

          {/* OG should match canonical exactly */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://echoesofhistoryai.org/" />
          <meta property="og:title" content="Echoes of History — Conversations with the Past" />
          <meta
            property="og:description"
            content="Enter a living digital museum and discover history through immersive conversation."
          />
          <meta property="og:image" content="https://echoesofhistoryai.org/images/og-image.jpg" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://echoesofhistoryai.org/images/og-image.jpg" />
      </Helmet>

      <div className="landing-page-container">
        <NavbarHome />
        <MuseumLanding />
      </div>
    </>
  );
}

export default LandingPage;
