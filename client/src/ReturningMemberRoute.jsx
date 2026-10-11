import { Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { useArchiveAuth } from './hooks/useArchiveAuth';

// Wait for Firebase to restore browser persistence before choosing a view.
// Kept outside LandingPage so the public homepage can still be prerendered.
// eslint-disable-next-line react/prop-types
export default function ReturningMemberRoute({ children }) {
  const [user, loading] = useArchiveAuth(auth);
  if (loading) return <div className="route-loading" role="status">Preparing your session…</div>;
  if (user) return <Navigate to="/user" replace />;
  return children;
}
