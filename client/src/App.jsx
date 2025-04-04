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
import { Analytics } from '@vercel/analytics/react';
import Submitted from './pages/submitted/submitted';
import Test from './test';
import About from './pages/about/about';
import Team from './pages/team/team';
import BlogPost from './pages/blog/blogContent/blogContent';
import Blog from './pages/blog/blog';

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
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/test" element={<Test />} />
          </Routes>
          <Analytics />
        </Router>
    </>
  )
}

export default App
