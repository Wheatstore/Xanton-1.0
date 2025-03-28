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
                <title>Home</title>
                <meta name="description" content="Chat with historical figures and dive deep into history like never before with Xanton AI." />
                <meta name="keywords" content="interactive history lessons, virtual history education, chat with historical figures, online history courses, history learning websites" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Xanton AI - Explore History with Interactive AI" />
                <meta property="og:description" content="Chat with historical figures and dive deep into history like never before with Xanton AI." />
                <meta property="og:url" content="https://www.xantonai.com" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.xantonai.com/og-image.jpg" />
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
