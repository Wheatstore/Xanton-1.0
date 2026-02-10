import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { Chat, LoginPage, LandingPage, SignupPage } from "./pages/pagesExport";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import AuthenticatedPage from "./pages/authenticated/authenticated";
import NewBotPage from "./pages/newBotPage/newBotPage";
import Admin from "./pages/admin/admin";
import UserProfilePage from "./pages/userProfile/userProfilePage";
import FeedbackPage from "./pages/feedbackPage/feedbackPage";
import Submitted from "./pages/submitted/submitted";

import ArticleListPage from "./pages/articles/ArticlesListPage";
import ArticlePage from "./pages/articles/ArticlePage";
import BotsDirectoryPage from "./pages/BotsDirectory/BotsDirectoryPage";
import About from "./pages/about/about";
import Team from "./pages/team/team";
import Features from "./pages/features/featuresPage";
import PrivacyPolicy from "./pages/privacy-tos/privacy";
import TermsOfService from "./pages/privacy-tos/tos";
import NotFound404 from "./pages/error/404";
import SitemapPage from "./pages/sitemap/sitemap";

// TODO (recommended for outreach + sitelinks)
// import Contact from "./pages/contact/contact";
// import Press from "./pages/press/press"; // media kit, announcements
// import Partners from "./pages/partners/partners"; // schools, orgs
// import SitemapPage from "./pages/sitemap/sitemap"; // human-readable sitemap
// import NotFound from "./pages/notFound/notFound";

function FullPageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Loading Echoes of History AI…
        </div>
        <div style={{ opacity: 0.7, fontSize: 14 }}>
          Preparing your session.
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <FullPageLoader />;

  const isAdmin = !!user && user.email === "yoonate25@gmail.com";

  return (
    <Router>
      <Routes>
        {/* =======================
            Public (SEO/indexable)
           ======================= */}
        <Route
          path="/"
          element={user ? <Navigate to="/user" replace /> : <LandingPage />}
        />

        <Route path="/about" element={<About />} />
        {/* <Route path="/team" element={<Team />} /> */}
        <Route path="/features" element={<Features />} />
        <Route path="/bots" element={<BotsDirectoryPage />} />
        <Route path='/articles' element={<ArticleListPage />} />
        <Route path='/articles/:slug' element={<ArticlePage />} />

        {/* Trust pages (important for indexing/credibility) */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Outreach pages (add when ready) */}
        {/* <Route path="/contact" element={<Contact />} /> */}
        {/* <Route path="/press" element={<Press />} /> */}
        {/* <Route path="/partners" element={<Partners />} /> */}

        <Route path="/sitemap" element={<SitemapPage />} />

        {/* Auth entry */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* =======================
            Private (behind auth)
           ======================= */}
        <Route
          path="/user"
          element={user ? <AuthenticatedPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/chat/:id/:name"
          element={user ? <Chat /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/create-new-bot"
          element={user ? <NewBotPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/submitted"
          element={user ? <Submitted /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile/:username"
          element={user ? <UserProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin"
          element={isAdmin ? <Admin /> : <Navigate to="/" replace />}
        />

        <Route path="/feedback" element={<FeedbackPage />} />

        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Router>
  );
}

export default App;
