import { Helmet } from "react-helmet";
import { useAuthState } from "react-firebase-hooks/auth";
import NavbarHome from "../../components/navbar/navbar";
import MuseumLanding from "../../components/landing/museum/MuseumLanding";
import { auth } from "../../firebase";
import "./landing.css";

function LandingPage() {
  const [, loading] = useAuthState(auth);
  if (loading) return null;

  return (
    <>
      <Helmet>
        <title>Echoes of History — Explore Lives That Shaped the World</title>
        <meta
          name="description"
          content="Explore historical lives through guided timelines, biographies, documents, ideas, debates, and letters across time."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://echoesofhistoryai.org/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://echoesofhistoryai.org/" />
        <meta property="og:title" content="Echoes of History — Explore Lives That Shaped the World" />
        <meta
          property="og:description"
          content="Enter a living digital museum and explore history through timelines, evidence, ideas, and correspondence."
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
