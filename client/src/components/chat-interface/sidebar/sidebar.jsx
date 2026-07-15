/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { userSignOut } from "../../../authenticationFunctions/signout";

function LogoMark() {
  return <img src="/images/logoTransparent.png" alt="Echoes of History" className="h-full w-full object-contain brightness-0" />;
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" aria-hidden="true">
      <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M5 18.5 3.5 21l.7-4A8 8 0 1 1 7 19.2M8 9h8M8 13h5" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
      <path strokeWidth="1.6" strokeLinejoin="round" d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" />
    </svg>
  );
}

function Sidebar({ activeCharacter = null, informationSections = [], activeInformationSection = "", onInformationSectionChange }) {
  const [user] = useAuthState(auth);
  const [previousChats, setPreviousChats] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const closeSettings = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", closeSettings);
    return () => document.removeEventListener("mousedown", closeSettings);
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    const chatsRef = collection(db, "users", user.uid, "previousChats");
    const chatsQuery = query(chatsRef, orderBy("timestamp", "desc"));

    return onSnapshot(chatsQuery, (snapshot) => {
      setPreviousChats(
        snapshot.docs.map((chatDoc) => ({ id: chatDoc.id, ...chatDoc.data() }))
      );
    });
  }, [user]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#fffcf7] text-stone-800">
      <div className="flex-none px-5 pb-5 pt-6">
        <button type="button" onClick={() => navigate("/")} className="group flex items-center gap-3 text-left">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-stone-300 bg-[#f8f5ef] p-2 transition group-hover:bg-white group-hover:text-black">
            <LogoMark />
          </span>
          <span>
            <span className="block font-serif text-lg font-semibold leading-none tracking-wide text-stone-950">Echoes</span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.23em] text-stone-500">of history</span>
          </span>
        </button>
      </div>

      <div className="flex-none px-4">
        <button
          type="button"
          onClick={() => navigate("/bots")}
          className="flex w-full items-center gap-3 rounded-xl border border-stone-200 bg-white/65 px-4 py-3 text-xs font-semibold text-stone-700 shadow-sm transition hover:border-stone-400 hover:bg-white"
        >
          <span aria-hidden="true">←</span>
          All characters
        </button>
      </div>

      {activeCharacter?.name && (
        <section className="flex-none px-4 pt-6">
          <p className="mb-3 px-1 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">Current conversation</p>
          <div className="rounded-2xl border border-stone-200/80 bg-white/55 p-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 flex-none overflow-hidden rounded-full border border-white bg-stone-200 shadow-sm">
                {activeCharacter.image ? (
                  <img src={activeCharacter.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <LogoMark />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-serif text-sm font-semibold text-stone-900">{activeCharacter.name}</p>
                <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-stone-500">
                  {activeCharacter.description || "Historical conversation in progress"}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <nav className="archive-scrollbar max-h-[42vh] flex-none space-y-1 overflow-y-auto px-4 pt-5">
        <button type="button" className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3 text-xs font-semibold text-stone-950 shadow-sm">
          <ChatIcon />
          Conversation
        </button>
        {informationSections.length > 0 && (
          <div className="pt-3">
            <p className="mb-2 px-1 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">Explore this figure</p>
            <div className="space-y-1">
              {informationSections.map((section) => (
                <button
                  type="button"
                  key={section.id}
                  onClick={() => onInformationSectionChange?.(section.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-xs transition ${
                    activeInformationSection === section.id
                      ? "bg-stone-900 font-semibold text-white shadow-sm"
                      : "font-medium text-stone-600 hover:bg-white/65 hover:text-stone-950"
                  }`}
                >
                  <span>{section.label}</span>
                  <span className={activeInformationSection === section.id ? "text-white/50" : "text-stone-300"}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <button type="button" onClick={() => navigate("/bots")} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-medium text-stone-600 transition hover:bg-white/65 hover:text-stone-950">
          <CompassIcon />
          Explore archive
        </button>
      </nav>

      <div className="relative mx-4 mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-[#e9e2d7] p-4">
        <p className="relative text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500">Reading room</p>
        <p className="relative mt-2 max-w-[170px] font-serif text-sm leading-5 text-stone-700">Voices, ideas, and choices preserved for curious minds.</p>
      </div>

      <div className="mx-5 mt-5 h-px flex-none bg-stone-300/70" />
      <p className="flex-none px-5 pb-2 pt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">Recent conversations</p>

      <div className="archive-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        {previousChats.length > 0 ? (
          <div className="space-y-1">
            {previousChats.map((chat) => (
              <button
                type="button"
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.character}/${chat.name}`)}
                className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-white/70"
              >
                <div className="h-8 w-8 flex-none overflow-hidden rounded-full bg-stone-200 grayscale transition group-hover:grayscale-0">
                  {chat.img ? <img src={chat.img} alt="" className="h-full w-full object-cover" loading="lazy" /> : <LogoMark />}
                </div>
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-stone-600 group-hover:text-stone-950">{chat.name}</span>
                <span className="text-stone-300 group-hover:text-stone-600">›</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-3 py-7 text-center">
            <p className="font-serif text-sm text-stone-500">The archive is quiet.</p>
            <p className="mt-1 text-[10px] text-stone-400">New conversations will appear here.</p>
          </div>
        )}
      </div>

      <div className="relative flex-none border-t border-stone-300/70 p-3" ref={settingsRef}>
        {showSettings && (
          <div className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl">
            <button type="button" onClick={() => navigate(`/profile/${user?.displayName}`)} className="w-full rounded-xl px-3 py-2.5 text-left text-xs font-medium text-stone-700 hover:bg-[#f1ede5]">Profile settings</button>
            <button type="button" onClick={userSignOut} className="w-full rounded-xl px-3 py-2.5 text-left text-xs font-medium text-stone-700 hover:bg-[#f1ede5]">Sign out</button>
          </div>
        )}

        <button type="button" onClick={() => setShowSettings((visible) => !visible)} className="flex w-full items-center gap-3 rounded-xl p-2 transition hover:bg-white/60">
          <div className="h-9 w-9 flex-none overflow-hidden rounded-full border border-stone-300 bg-stone-900 text-white">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-full w-full object-cover grayscale" />
            ) : (
              <span className="grid h-full place-items-center text-xs font-semibold">{user?.displayName?.[0] || user?.email?.[0] || "?"}</span>
            )}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-xs font-semibold text-stone-800">{user?.displayName || user?.email || "Reader"}</p>
            <p className="mt-0.5 text-[10px] text-stone-400">Account</p>
          </div>
          <span className={`text-stone-400 transition ${showSettings ? "rotate-180" : ""}`}>⌃</span>
        </button>
      </div>

      <style>{`
        .archive-scrollbar::-webkit-scrollbar { width: 5px; }
        .archive-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .archive-scrollbar::-webkit-scrollbar-thumb { background: rgba(120, 113, 108, .22); border-radius: 999px; }
      `}</style>
    </div>
  );
}

export default Sidebar;
