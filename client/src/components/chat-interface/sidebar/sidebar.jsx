/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LogOut, Settings } from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useArchiveAuth } from "../../../hooks/useArchiveAuth";
import { auth, db } from "../../../firebase";
import { userSignOut } from "../../../authenticationFunctions/signout";

export function ConversationNavigation({ user, chats = [], loading = false, error = "", activeCharacter, onSignOut }) {
  return <div className="cw-navigation">
    <div className="cw-navigation-heading"><p className="cw-eyebrow">Your reading room</p><h2 id="conversations-title">My conversations</h2><Link to="/bots"><ArrowLeft size={16} />Meet another figure</Link></div>
    <div className="cw-recent-list">
      {loading ? <p className="cw-nav-note" role="status">Loading conversations…</p> : error ? <p className="cw-nav-note" role="alert">{error}</p> : chats.length ? chats.map(chat => <Link key={chat.id} to={`/chat/${encodeURIComponent(chat.character)}/${encodeURIComponent(chat.name)}`} aria-current={activeCharacter?.id === chat.character ? "page" : undefined}>
        <div>{chat.img ? <img src={chat.img} alt="" loading="lazy" /> : <span>{chat.name?.[0] || "?"}</span>}</div><span>{chat.name}<small>{activeCharacter?.id === chat.character ? "Current conversation" : "Continue the conversation"}</small></span><span aria-hidden="true">→</span>
      </Link>) : <div className="cw-nav-note"><p>A new conversation is a new perspective.</p><p>Your conversations will appear here after you choose a figure.</p></div>}
    </div>
    <footer className="cw-navigation-account"><p>{user?.displayName || "Reader"}</p><Link to={`/profile/${encodeURIComponent(user?.displayName || "reader")}`}><Settings size={16} />Profile settings</Link><button type="button" onClick={onSignOut}><LogOut size={16} />Sign out</button></footer>
  </div>;
}

export default function Sidebar({ activeCharacter }) {
  const [user] = useArchiveAuth(auth);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user || !db) { setLoading(false); return undefined; }
    return onSnapshot(query(collection(db, "users", user.uid, "previousChats"), orderBy("timestamp", "desc")), snapshot => {
      setChats(snapshot.docs.map(item => ({ ...item.data(), id: item.id }))); setLoading(false);
    }, () => { setError("Recent conversations couldn’t be loaded. You can still browse all figures."); setLoading(false); });
  }, [user]);
  return <ConversationNavigation user={user} chats={chats} loading={loading} error={error} activeCharacter={activeCharacter} onSignOut={userSignOut} />;
}
