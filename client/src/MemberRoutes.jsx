import { lazy, Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useArchiveAuth } from "./hooks/useArchiveAuth";
import { auth } from './firebase';

const Authenticated = lazy(() => import('./pages/authenticated/authenticated'));
const Chat = lazy(() => import('./pages/chat/chat'));
const NewBot = lazy(() => import('./pages/newBotPage/newBotPage'));
const Submitted = lazy(() => import('./pages/submitted/submitted'));
const Profile = lazy(() => import('./pages/userProfile/userProfilePage'));
const Admin = lazy(() => import('./pages/admin/admin'));

export default function MemberRoutes() {
  const [user, loading] = useArchiveAuth(auth);
  const { pathname } = useLocation();
  if (loading) return <div className="route-loading" role="status">Preparing your session…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (pathname.replace(/\/$/, '') === '/admin' && user.email !== 'yoonate25@gmail.com') return <Navigate to="/" replace />;
  const Component = pathname.startsWith('/chat/') ? Chat : pathname.startsWith('/profile/') ? Profile : ({ '/user': Authenticated, '/create-new-bot': NewBot, '/submitted': Submitted, '/admin': Admin })[pathname.replace(/\/$/, '')];
  if (!Component) return <Navigate to="/user" replace />;
  return <Suspense fallback={<div className="route-loading" role="status">Opening your collection…</div>}><Component /></Suspense>;
}
