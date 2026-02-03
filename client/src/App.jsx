import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { Chat, LoginPage, LandingPage, SignupPage } from './pages/pagesExport';
import { auth } from './firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import AuthenticatedPage from './pages/authenticated/authenticated';
import NewBotPage from './pages/newBotPage/newBotPage';
import Admin from './pages/admin/admin';
import UserProfile from './components/userProfile/userProfile';
import UserProfilePage from './pages/userProfile/userProfilePage';
import FeedbackPage from './pages/feedbackPage/feedbackPage';
import Submitted from './pages/submitted/submitted';
import BotsDirectory from './pages/BotsDirectory/BotsDirectory'
import About from './pages/about/about';
import Team from './pages/team/team';
import Features from './pages/features/featuresPage';
import PrivacyPolicy from './pages/privacy-tos/privacy';
import TermsOfService from './pages/privacy-tos/tos';

function App() {
  const [user, loading] = useAuthState(auth)

  if (loading) {
    return (
      <>
      
      </>
    )
  }
  
  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={user? <Navigate to="/user" /> : <LandingPage />} />
            <Route path="/chat/:id/:name" element={user ? <Chat /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/user" element={user ? <AuthenticatedPage /> : <Navigate to="/login"/>} />
            <Route path="/create-new-bot" element={user? <NewBotPage /> : <Navigate to="/login" />} />
            <Route path="submitted" element={user ? <Submitted /> : <Navigate to="/" />} />
            <Route path="/admin" element={user && user.email === "yoonate25@gmail.com" ? <Admin /> : <Navigate to="/" />} />
            <Route path="/profile/:username" element={user ? <UserProfilePage />: <Navigate to="/chat" />} />
            <Route path="/feedback" element={user ? <FeedbackPage /> : <Navigate to="/" />} />
            <Route path="/about" element={<About />} />
            <Route path="/bots" element={<BotsDirectory />} />
            <Route path="/features" element={<Features />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </Router>
    </>
  )
}

export default App
