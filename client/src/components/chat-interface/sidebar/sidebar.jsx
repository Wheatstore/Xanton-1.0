import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { userSignOut } from "../../../authenticationFunctions/signout";

function Sidebar() {
  const [user] = useAuthState(auth);
  const [previousChats, setPreviousChats] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  
  const navigate = useNavigate();

  // Handle clicks outside settings dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to get all past chats
  useEffect(() => {
    if (user) {
      const previousChatsRef = collection(db, "users", user.uid, "previousChats");
      const q = query(previousChatsRef, orderBy("timestamp", "desc"));
      
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
    <div className="flex flex-col h-full bg-black text-white border-r border-gray-800">
      {/* Logo and Brand */}
      <div className="px-5 py-6">
        <button 
          onClick={() => navigate("/user")} 
          className="flex items-center space-x-2 group"
        >
          <img 
            src="/images/logoTransparent.png" 
            alt="Xanton" 
            className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" 
          />
          <h1 className="text-2xl font-semibold ">
            Historia
          </h1>
        </button>
      </div>
      
      {/* Navigation */}
      <div className="px-4 mb-6">
        <button 
          onClick={() => navigate("/user")} 
          className="flex items-center w-full px-4 py-3 space-x-3 text-gray-300 transition-all duration-200 rounded-lg hover:bg-gray-800 hover:text-white focus:outline-none"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            height="1.5em"
            aria-hidden="true"
            className="text-gray-400 group-hover:text-white"
          >
            <path 
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m12.524-3.753a1 1 0 0 1 1.228 1.228l-1.12 4.105a1.5 1.5 0 0 1-1.052 1.052l-4.105 1.12a1 1 0 0 1-1.228-1.228l1.12-4.105a1.5 1.5 0 0 1 1.052-1.052z" 
              fill="currentColor" 
              fillRule="evenodd"
            />
          </svg>
          <span>Explore</span>
        </button>
      </div>
      
      {/* Chats Section */}
      <div className="px-4 mb-4">
        <h3 className="px-2 mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
          Chats
        </h3>
        <div className="space-y-1">
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-2"></div>
        </div>
      </div>
      
      {/* Chat List */}
      <div className="flex-1 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {previousChats.length > 0 ? (
          <div className="space-y-1">
            {previousChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.character}/${chat.name}`)}
                className="flex items-center w-full px-3 py-2 space-x-3 text-gray-300 transition-all duration-200 rounded-lg hover:bg-gray-800 focus:outline-none"
              >
                <div className="relative flex-shrink-0">
                  <img 
                    className="w-9 h-9 rounded-full object-cover border border-gray-700" 
                    src={chat.img} 
                    alt={chat.name} 
                    loading="lazy" 
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>
                </div>
                <span className="truncate">{chat.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 px-4 text-center text-gray-500">
            <svg className="w-10 h-10 mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No chats yet</p>
          </div>
        )}
      </div>
      
      {/* User Profile Section */}
      <div className="mt-auto border-t border-gray-800">
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center w-full px-4 py-3 space-x-3 text-gray-300 transition-all duration-200 hover:bg-gray-800"
          >
            <div className="relative">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border border-gray-700" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.displayName || user?.email || "User"}
              </p>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showSettings ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Settings Dropdown */}
          {showSettings && (
            <div className="absolute bottom-full left-0 w-full mb-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-10">
              <div className="py-1">
                <button
                  onClick={() => navigate(`/profile/${user.displayName}`)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <svg className="mr-2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                <button
                  onClick={userSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                >
                  <svg className="mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;