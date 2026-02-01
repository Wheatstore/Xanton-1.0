import React from "react";
import { Helmet } from "react-helmet";
import HeroSection from "../../components/landing/hero/hero";
import NavbarHome from "../../components/navbar/navbar";
import Footer from "../../components/landing/footer/footer";
import "./landing.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Product from "../../components/product/product";

function LandingPage() {
  const [user, loading] = useAuthState(auth);
  if (loading) return null;

  const SITE_NAME = "Echoes of History AI";
  const BASE_URL = "https://echoesofhistoryai.org";
  const CANONICAL_URL = `${BASE_URL}/`;
  const OG_IMAGE = `${BASE_URL}/images/og-image.jpg`;
  const LOGO_URL = `${BASE_URL}/images/logo.png`;

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>{SITE_NAME}: Chat with Historical Figures | AI Education Platform</title>
        <meta
          name="description"
          content="Experience history through conversation. Chat with AI-powered historical figures and learn through interactive dialogue on Echoes of History AI."
        />
        <meta name="robots" content="index, follow" />

        {/* Canonical */}
        <link rel="canonical" href={CANONICAL_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:title" content={`${SITE_NAME}: Chat with Historical Figures`} />
        <meta
          property="og:description"
          content="Talk with AI-powered historical figures and learn history through interactive conversation."
        />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content={`${SITE_NAME} – interactive history conversations`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="en_US" />

        {/* Twitter (no handles) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL} />
        <meta name="twitter:title" content={`${SITE_NAME}: Chat with Historical Figures`} />
        <meta
          name="twitter:description"
          content="Interactive AI conversations with historical figures. Learn through dialogue on Echoes of History AI."
        />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content={`${SITE_NAME} – interactive history conversations`} />

        {/* Theme */}
        <meta name="theme-color" content="#4a56e2" />

        {/* Structured Data: Organization (NO social links) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: BASE_URL,
            logo: LOGO_URL
          })}
        </script>

        {/* Structured Data: WebSite */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: BASE_URL
          })}
        </script>
      </Helmet>

      <div className="landing-page-container">
        <NavbarHome />
        <HeroSection />
        <Product isLanding={true} />
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
