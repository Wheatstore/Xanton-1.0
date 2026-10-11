import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './pages/landing/landing';
import RouteSEO from './seo/RouteSEO';
import './App.css';

const About = lazy(() => import('./pages/about/about'));
const Features = lazy(() => import('./pages/features/featuresPage'));
const BotsDirectory = lazy(() => import('./pages/BotsDirectory/BotsDirectoryPage'));
const Articles = lazy(() => import('./pages/articles/ArticlesListPage'));
const Article = lazy(() => import('./pages/articles/ArticlePage'));
const Partners = lazy(() => import('./pages/partner/Partner'));
const Privacy = lazy(() => import('./pages/privacy-tos/privacy'));
const Terms = lazy(() => import('./pages/privacy-tos/tos'));
const Sitemap = lazy(() => import('./pages/sitemap/sitemap'));
const Login = lazy(() => import('./pages/auth/loginPage'));
const Signup = lazy(() => import('./pages/auth/signupPage'));
const Feedback = lazy(() => import('./pages/feedbackPage/feedbackPage'));
const NotFound = lazy(() => import('./pages/error/404'));
const MemberRoutes = lazy(() => import('./MemberRoutes'));
const ReturningMemberRoute = lazy(() => import('./ReturningMemberRoute'));

function ScrollToPage() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return <BrowserRouter><RouteSEO /><ScrollToPage /><Suspense fallback={<div className="route-loading" role="status">Opening the archive…</div>}><Routes>
    <Route path="/" element={<ReturningMemberRoute><LandingPage /></ReturningMemberRoute>} />
    <Route path="/about" element={<About />} />
    <Route path="/features" element={<Features />} />
    <Route path="/bots" element={<BotsDirectory />} />
    <Route path="/articles" element={<Articles />} />
    <Route path="/articles/:slug" element={<Article />} />
    <Route path="/partners" element={<Partners />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/sitemap" element={<Sitemap />} />
    <Route path="/login" element={<ReturningMemberRoute><Login /></ReturningMemberRoute>} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/feedback" element={<Feedback />} />
    {['/user', '/chat/:id/:name', '/create-new-bot', '/submitted', '/profile/:username', '/admin'].map(path => <Route key={path} path={path} element={<MemberRoutes />} />)}
    <Route path="*" element={<NotFound />} />
  </Routes></Suspense></BrowserRouter>;
}
