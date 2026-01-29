import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

function BotCard({ person, index }) {
  const [user] = useAuthState(auth);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const onClick = async (botid) => {
    if (!user) {
      navigate(`/signup`);
    } else {
      try {
        const previousChatsRef = collection(db, 'users', user.uid, 'previousChats');
        const q = query(previousChatsRef, where('character', '==', botid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await addDoc(previousChatsRef, {
            img: person.img,
            name: person.name,
            character: botid,
            timestamp: serverTimestamp()
          });
          navigate(`/chat/${botid}/${person.name}`);
        } else {
          navigate(`/chat/${botid}/${person.name}`);
        }
      } catch (error) {
        console.error("Error checking or adding document: ", error);
      }
    }
  };

  return (
    <div
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
      />

      {/* Main card */}
      <div className="relative h-full flex flex-col bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-white/30 group-hover:shadow-2xl group-hover:shadow-purple-500/20">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {person.img && (
            <>
              {/* Loading shimmer */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </div>
              )}
              
              {/* Actual image */}
              <img
                className={`w-full h-full object-cover transition-all duration-700 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                } group-hover:scale-110`}
                src={person.img}
                alt={`${person.name}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Animated corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          )}

          {/* Floating badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-white font-semibold">Available</span>
          </div>
        </div>

        {/* Content section */}
        <div className="flex-1 flex flex-col p-6 relative">
          {/* Name with gradient on hover */}
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-600">
            {person.name}
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-300 transition-colors duration-300">
            {person.description}
          </p>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action area */}
          <div className="flex items-center justify-between gap-3">
            {/* Chat button */}
            <button
              className="group/btn relative flex-1 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-95"
              onClick={() => onClick(person.id)}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover/btn:rotate-12"
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
                <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">
                  →
                </span>
              </span>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            </button>

            {/* Info button */}
            <button
              className="group/info p-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-110 active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                // Add info modal logic here
              }}
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover/info:text-white transition-colors duration-300"
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

          {/* Stats bar - appears on hover */}
          <div
            className={`mt-4 flex items-center justify-between text-xs text-gray-500 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="text-white font-semibold">4.9</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💬</span>
              <span>{Math.floor(Math.random() * 5000 + 1000)}+ chats</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🕒</span>
              <span>Avg {Math.floor(Math.random() * 20 + 5)}m</span>
            </div>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-600/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/10 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default BotCard;