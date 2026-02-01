import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '../../components/landing/hero/hero';
import NavbarHome from "../../components/navbar/navbar";
import Footer from '../../components/landing/footer/footer';
import "./landing.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Product from '../../components/product/product';

function LandingPage() {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return (
            <>
                {/* You can add a loading spinner or any other loading indicator here */}
            </>
        );
    }

    return (
        <>
            <Helmet>
                {/* Primary Meta Tags */}
                <title>Xanton AI - Chat with Historical Figures | Interactive History Learning</title>
                <meta name="title" content="Xanton AI - Chat with Historical Figures | Interactive History Learning" />
                <meta name="description" content="Experience history like never before. Chat with historical figures through AI, explore interactive history lessons, and dive deep into the past with Xanton AI's revolutionary learning platform." />
                <meta name="keywords" content="xanton ai, chat with historical figures, interactive history lessons, virtual history education, AI history learning, online history courses, history learning websites, historical AI chat, educational AI" />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://www.xantonai.com" />
                
                {/* Robots */}
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.xantonai.com" />
                <meta property="og:title" content="Xanton AI - Chat with Historical Figures | Interactive History Learning" />
                <meta property="og:description" content="Experience history like never before. Chat with historical figures through AI, explore interactive history lessons, and dive deep into the past with Xanton AI." />
                <meta property="og:image" content="https://www.xantonai.com/og-image.jpg" />
                <meta property="og:image:alt" content="Xanton AI - Interactive History Learning Platform" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="Xanton AI" />
                <meta property="og:locale" content="en_US" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://www.xantonai.com" />
                <meta name="twitter:title" content="Xanton AI - Chat with Historical Figures | Interactive History Learning" />
                <meta name="twitter:description" content="Experience history like never before. Chat with historical figures through AI, explore interactive history lessons, and dive deep into the past." />
                <meta name="twitter:image" content="https://www.xantonai.com/og-image.jpg" />
                <meta name="twitter:image:alt" content="Xanton AI - Interactive History Learning Platform" />
                
                {/* Additional SEO Meta Tags */}
                <meta name="author" content="Xanton AI" />
                <meta name="language" content="English" />
                <meta name="revisit-after" content="7 days" />
                <meta name="theme-color" content="#ffffff" />
                
                {/* Structured Data - Organization */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Xanton AI",
                        "url": "https://www.xantonai.com",
                        "logo": "https://www.xantonai.com/logo.png",
                        "description": "Interactive AI-powered platform for learning history by chatting with historical figures",
                        "sameAs": [
                            // Add your social media URLs here
                            // "https://www.facebook.com/xantonai",
                            // "https://twitter.com/xantonai",
                            // "https://www.linkedin.com/company/xantonai"
                        ]
                    })}
                </script>
                
                {/* Structured Data - WebSite */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "Xanton AI",
                        "url": "https://www.xantonai.com",
                        "description": "Chat with historical figures and explore interactive history lessons",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://www.xantonai.com/search?q={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    })}
                </script>
                
                {/* Structured Data - Educational Organization */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "EducationalOrganization",
                        "name": "Xanton AI",
                        "description": "AI-powered interactive history learning platform",
                        "url": "https://www.xantonai.com",
                        "areaServed": "Worldwide",
                        "educationalCredentialAwarded": "History Education"
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