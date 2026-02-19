import React from "react";
import { Helmet } from "react-helmet";
import HeroSection from "../../components/landing/hero/hero";
import NavbarHome from "../../components/navbar/navbar";
import Footer from "../../components/landing/footer/footer";
import "./landing.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Product from "../../components/product/product";
import LandingChat from "../../components/landing/Chatbox/LandingChat";

function LandingPage() {
  const [user, loading] = useAuthState(auth);
  if (loading) return null;

  const SITE_NAME = "Echoes of History AI";
  const BASE_URL = "https://echoesofhistoryai.org";
  const OG_IMAGE = `${BASE_URL}/og-image.jpg`;
  const LOGO_URL = `${BASE_URL}/logo.png`;

  return (
    <>
        <Helmet>
          <title>Echoes of History AI: Chat with Historical Figures</title>
          <meta
            name="description"
            content="Experience history through conversation. Chat with AI-powered historical figures and learn through interactive dialogue."
          />
          <meta name="robots" content="index, follow" />

          {/* Canonical MUST match final URL exactly (note trailing slash) */}
          <link rel="canonical" href="https://echoesofhistoryai.org/" />

          {/* OG should match canonical exactly */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://echoesofhistoryai.org/" />
          <meta property="og:title" content="Echoes of History AI: Chat with Historical Figures" />
          <meta
            property="og:description"
            content="Chat with historical figures from the past and learn history through interactive conversation."
          />
          <meta property="og:image" content="https://echoesofhistoryai.org/images/og-image.jpg" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://echoesofhistoryai.org/images/og-image.jpg" />
      </Helmet>

      <div className="landing-page-container">
        <NavbarHome />
        <HeroSection />
        <LandingChat />
        <Product isLanding={true} />
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
