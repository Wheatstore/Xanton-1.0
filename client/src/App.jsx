import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { Chat, LoginPage, LandingPage, SignupPage } from './pages/pagesExport';
import { auth } from './firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import AuthenticatedPage from './pages/authenticated/authenticated';

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
            <Route path="/chat/:id" element={user ? <Chat /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/user" element={user ? <AuthenticatedPage /> : <Navigate to="/login"/>} />
          </Routes>
        </Router>
    </>
  )
}

export default App
