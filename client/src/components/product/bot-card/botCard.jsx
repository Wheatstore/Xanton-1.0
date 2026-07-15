/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Info, User } from "lucide-react";
import { db, auth } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

function BotCard({ person, index, isGridView = true }) {
  const [user] = useAuthState(auth);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const descriptor =
    person.role ||
    person.occupation ||
    person.knownFor ||
    person.title ||
    "Historical figure";

  const archiveNote =
    person.description ||
    person.biography ||
    person.about ||
    "Step into a conversation shaped by major moments, lived decisions, and the perspective of another era.";

  const locationLine =
    person.birthPlace || person.location || person.country || person.era || "";

  const openChat = async (botId) => {
    if (isNavigating) return;

    if (!user) {
      navigate("/signup");
      return;
    }

    setIsNavigating(true);

    try {
      const chatId = `${botId}_${person.name.replace(/\s+/g, "_")}`;
      const chatDocRef = doc(db, "users", user.uid, "previousChats", chatId);
      const chatDoc = await getDoc(chatDocRef);

      if (!chatDoc.exists()) {
        await setDoc(chatDocRef, {
          img: person.img,
          name: person.name,
          character: botId,
          timestamp: serverTimestamp(),
        });
      } else {
        await setDoc(
          chatDocRef,
          {
            timestamp: serverTimestamp(),
          },
          { merge: true }
        );
      }

      navigate(`/chat/${botId}/${person.name}`);
    } catch (error) {
      console.error("Error checking or adding document: ", error);
      setIsNavigating(false);
    }
  };

  return (
    <article
      className={`group relative h-full cursor-pointer outline-none ${
        isGridView ? "" : "min-h-[290px]"
      }`}
      onClick={() => openChat(person.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openChat(person.id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(214,190,151,0.3),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.7),rgba(244,238,228,0.85))] opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

      <div
        className={`relative h-full overflow-hidden rounded-[32px] border border-stone-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,240,228,0.96))] shadow-[0_22px_55px_rgba(58,44,29,0.08)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_28px_70px_rgba(58,44,29,0.12)] ${
          isGridView ? "flex flex-col" : "grid gap-0 md:grid-cols-[260px_minmax(0,1fr)]"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />

        <div className={`relative overflow-hidden ${isGridView ? "aspect-[4/5]" : "h-full min-h-[290px]"}`}>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#ddcfba,#f1e7d8,#ddd9d0)]" />
          )}

          {person.img ? (
            <img
              className={`h-full w-full object-cover transition duration-700 ${
                imageLoaded ? "opacity-100 group-hover:scale-[1.03]" : "opacity-0"
              }`}
              src={person.img}
              alt={person.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#e8dcc7,#f7f1e7)] text-stone-500">
              <User className="h-12 w-12" />
            </div>
          )}

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,15,0.05),transparent_34%,rgba(32,24,18,0.78))]" />

          <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <span className="rounded-full border border-white/55 bg-white/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-stone-700 backdrop-blur-md">
              Historical dossier
            </span>
            <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur-md">
              No. {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/65">
              Conversational profile
            </p>
            <h3 className="mt-2 font-serif text-3xl leading-none">
              {person.name}
            </h3>
            <p className="mt-2 max-w-[22rem] text-sm text-white/80">
              {descriptor}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
            <span className="rounded-full border border-stone-200 bg-white/80 px-3 py-1">
              Archive ready
            </span>
            {locationLine && (
              <span className="rounded-full border border-stone-200/80 bg-[#f4ede1] px-3 py-1 text-stone-500">
                {locationLine}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-7 text-stone-600 line-clamp-3">
            {archiveNote}
          </p>

          <div className="mt-5 flex-1 rounded-[24px] border border-dashed border-stone-200 bg-[rgba(255,255,255,0.45)] px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
              Archive note
            </p>
            <p className="mt-2 text-sm leading-7 text-stone-600 line-clamp-2">
              Ask about upbringing, turning points, disagreements, or the way
              this figure understood their time.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-black ${
                isNavigating ? "opacity-60" : ""
              }`}
            >
              {isNavigating ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Opening conversation
                </>
              ) : (
                <>
                  Begin conversation
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </div>

            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white/85 text-stone-600 transition hover:border-stone-300 hover:text-stone-900"
              onClick={(event) => event.stopPropagation()}
              aria-label={`More about ${person.name}`}
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .line-clamp-2,
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          -webkit-line-clamp: 2;
        }

        .line-clamp-3 {
          -webkit-line-clamp: 3;
        }
      `}</style>
    </article>
  );
}

export default BotCard;
