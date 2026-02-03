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
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white border-r border-purple-500/10 relative overflow-hidden">
      {/* Flowing background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
      </div>

      {/* Logo and Brand */}
      <div className="px-6 py-8 relative z-10">
        <button 
          onClick={() => navigate("/user")} 
          className="flex items-center space-x-3 group w-full"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
            <img 
              src="/images/logoTransparent.png" 
              alt="Echoes of History Logo" 
              className="w-11 h-11 relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" 
            />
          </div>
          <h1 className="text-2xl font-light tracking-wide bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
            Historia
          </h1>
        </button>
      </div>
      
      {/* Navigation */}
      <div className="px-4 mb-6 relative z-10">
        <button 
          onClick={() => navigate("/user")} 
          className="flex items-center w-full px-5 py-3.5 space-x-3 text-gray-300 transition-all duration-300 rounded-[20px] hover:bg-gradient-to-br hover:from-purple-900/30 hover:to-blue-900/30 hover:text-white focus:outline-none border border-transparent hover:border-purple-500/20 backdrop-blur-sm group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center group-hover:from-purple-600/40 group-hover:to-blue-600/40 transition-all duration-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              height="1.25em"
              aria-hidden="true"
              className="text-purple-400 group-hover:text-purple-300"
            >
              <path 
                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m12.524-3.753a1 1 0 0 1 1.228 1.228l-1.12 4.105a1.5 1.5 0 0 1-1.052 1.052l-4.105 1.12a1 1 0 0 1-1.228-1.228l1.12-4.105a1.5 1.5 0 0 1 1.052-1.052z" 
                fill="currentColor" 
                fillRule="evenodd"
              />
            </svg>
          </div>
          <span className="font-medium">Explore</span>
        </button>
      </div>
      
      {/* Chats Section */}
      <div className="px-4 mb-3 relative z-10">
        <h3 className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Recent Chats
        </h3>
        {/* Flowing divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
      </div>
      
      {/* Chat List */}
      <div className="flex-1 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent relative z-10">
        {previousChats.length > 0 ? (
          <div className="space-y-1.5">
            {previousChats.map((chat, index) => (
              <button
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.character}/${chat.name}`)}
                className="flex items-center w-full px-3 py-3 space-x-3 text-gray-300 transition-all duration-300 rounded-[18px] hover:bg-gradient-to-br hover:from-gray-800/60 hover:to-gray-900/60 hover:text-white focus:outline-none border border-transparent hover:border-purple-500/20 backdrop-blur-sm group animate-slideIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative flex-shrink-0">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img 
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/30 relative group-hover:border-purple-500/60 transition-all duration-300" 
                    src={chat.img} 
                    alt={chat.name} 
                    loading="lazy" 
                  />
                  {/* Status indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-black shadow-lg"></div>
                </div>
                <span className="truncate text-sm font-medium">{chat.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 px-4 text-center text-gray-500 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center mb-3 border border-purple-500/10">
              <svg className="w-7 h-7 text-purple-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">No conversations yet</p>
            <p className="text-xs text-gray-700 mt-1">Start exploring to begin</p>
          </div>
        )}
      </div>
      
      {/* User Profile Section */}
      <div className="mt-auto border-t border-purple-500/10 relative z-10">
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center w-full px-5 py-4 space-x-3 text-gray-300 transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-800/40 hover:to-gray-900/40 backdrop-blur-sm group"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/40 to-blue-500/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/30 relative group-hover:border-purple-500/60 transition-all duration-300" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 flex items-center justify-center shadow-lg relative">
                  <span className="text-white text-sm font-semibold">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-200 group-hover:text-white transition-colors">
                {user?.displayName || user?.email || "User"}
              </p>
              <p className="text-xs text-gray-600 truncate">View profile</p>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-all duration-300 ${showSettings ? 'rotate-180 text-purple-400' : 'group-hover:text-gray-400'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Settings Dropdown */}
          {showSettings && (
            <div className="absolute bottom-full left-0 right-0 mx-2 mb-2 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-[20px] shadow-2xl border border-purple-500/20 overflow-hidden z-20 animate-slideUp">
              {/* Subtle glow at top */}
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>
              
              <div className="py-2">
                <button
                  onClick={() => navigate(`/profile/${user.displayName}`)}
                  className="flex items-center w-full px-5 py-3 text-sm text-gray-300 hover:text-white hover:bg-purple-900/20 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center mr-3 group-hover:bg-purple-900/50 transition-all duration-200">
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Settings</span>
                </button>
                
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent my-1 mx-4"></div>
                
                <button
                  onClick={userSignOut}
                  className="flex items-center w-full px-5 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-full bg-red-900/20 flex items-center justify-center mr-3 group-hover:bg-red-900/30 transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="font-medium">Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
          }
          33% { 
            transform: translate(30px, -30px) scale(1.1);
          }
          66% { 
            transform: translate(-30px, 30px) scale(0.9);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-blob {
          animation: blob 20s ease-in-out infinite;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }

        .scrollbar-thumb-purple-900\/50::-webkit-scrollbar-thumb {
          background-color: rgba(88, 28, 135, 0.5);
          border-radius: 10px;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </div>
  );
}

export default Sidebar;