import "./sidebar.css";
import { auth } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

function Sidebar() {
  const [user] = useAuthState(auth);
  const [previousChats, setPreviousChats] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  const navigate = useNavigate();

  // Function to get all past chats
  useEffect(() => {
    if (user) {
      const previousChatsRef = collection(db, "users", user.uid, "previousChats");
      const q = query(previousChatsRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const previousChatsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPreviousChats(previousChatsList);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div className="sidebar-container">
      <div className="logo-heading-container">
        <button onClick={() => navigate("/user")} type="button">
          <h1 className="sidebar-logo-heading">Xanton</h1>
        </button>
      </div>
      <div className="explore-xanton-button-container">
        <button onClick={() => navigate("/user")} className="explore-xanton-button">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            color="var(--icon-secondary)"
            height="2em"
            className="mr-1"
            aria-hidden="true"
            focusable="false"
            tabIndex="-1"
          >
            <path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m12.524-3.753a1 1 0 0 1 1.228 1.228l-1.12 4.105a1.5 1.5 0 0 1-1.052 1.052l-4.105 1.12a1 1 0 0 1-1.228-1.228l1.12-4.105a1.5 1.5 0 0 1 1.052-1.052z" 
            fill="currentColor" 
            fillRule="evenodd">
            </path>
          </svg>
          Explore
        </button>
      </div>
      <div className="user-account-information-container"></div>
      <div className="previous-chats-container">
        <h3 className="previous-chats-heading">Chats</h3>
        {previousChats.map((chat) => (
          <div onClick={() => navigate(`/chat/${chat.character}`)} key={chat.id} className="chat-item">
            <img className="chat-item-image" src={chat.img} alt="" />
            <p>{chat.name}</p>
          </div>
        ))}
      </div>
      <div onClick={() => setShowSettings((prev) => !prev)} className="user-sidebar-account-information">
        <img src={user.photoURL} alt="" />
        <h3>{user.displayName}</h3>
        <button className="dropdown-toggle" >
          <span>▼</span>
        </button>
      </div>
      {showSettings && (
          <ul className="sidebar-dropdown-menu">
            <li className="sidebar-dropdown-item">Settings</li>
            <li className="sidebar-dropdown-item">Logout</li>
          </ul>
        )}
    </div>
  );
}

export default Sidebar;
