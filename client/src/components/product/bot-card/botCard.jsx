import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

function BotCard({ person, index }) {
  const [user] = useAuthState(auth);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const onClick = async (botid) => {
    // Prevent double-clicks
    if (isNavigating) return;
    
    if (!user) {
      navigate(`/signup`);
    } else {
      setIsNavigating(true);
      
      try {
        // Use a consistent document ID instead of auto-generated IDs
        const chatId = `${botid}_${person.name.replace(/\s+/g, '_')}`;
        const chatDocRef = doc(db, 'users', user.uid, 'previousChats', chatId);
        
        // Check if this specific chat document exists
        const chatDoc = await getDoc(chatDocRef);
        
        if (!chatDoc.exists()) {
          // Create the chat with the specific ID
          await setDoc(chatDocRef, {
            img: person.img,
            name: person.name,
            character: botid,
            timestamp: serverTimestamp()
          });
        } else {
          // Update the timestamp to move it to the top of the list
          await setDoc(chatDocRef, {
            timestamp: serverTimestamp()
          }, { merge: true });
        }
        
        navigate(`/chat/${botid}/${person.name}`);
      } catch (error) {
        console.error("Error checking or adding document: ", error);
        setIsNavigating(false);
      }
    }
  };

  return (
    <div
      className="group relative h-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(person.id)}
    >
      {/* Simplified glow - only on hover, no blur animation */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-blue-600/0 group-hover:from-purple-600/20 group-hover:via-pink-600/20 group-hover:to-blue-600/20 rounded-2xl transition-all duration-300 -z-10" />

      {/* Main card - reduced backdrop blur */}
      <div className="relative h-full flex flex-col bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-purple-500/50 group-hover:shadow-xl group-hover:shadow-purple-500/10">
        
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-950">
          {person.img && (
            <>
              {/* Simple loading state - no shimmer animation */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
              )}
              
              {/* Image with simple fade-in */}
              <img
                className={`w-full h-full object-cover transition-all duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                } group-hover:scale-105`}
                src={person.img}
                alt={person.name}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />

              {/* Static gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            </>
          )}

          {/* Simple status badge - no animations */}
          {isHovered && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 border border-purple-500/30 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span className="text-xs text-white font-medium">Available</span>
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="flex-1 flex flex-col p-5 relative bg-gray-950">
          {/* Name */}
          <h2 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-purple-400 transition-colors duration-300">
            {person.name}
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {person.description}
          </p>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Simple stats - always visible, no hover animation */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-700/50">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-gray-300">4.9</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💬</span>
              <span>{Math.floor(Math.random() * 5000 + 1000)}+</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {/* Primary chat button - REMOVED onClick since card handles it */}
            <div className={`flex-1 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 flex items-center justify-center gap-2 ${
              isNavigating ? 'opacity-50' : ''
            }`}>
              {isNavigating ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Start Chat
                </>
              )}
            </div>

            {/* Info button */}
            <button
              className="p-2.5 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 hover:border-purple-500/50 transition-all duration-200 active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                // Add info modal logic here
              }}
            >
              <svg
                className="w-5 h-5 text-gray-400 hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default BotCard;