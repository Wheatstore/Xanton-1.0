/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, UserRound } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

function MuseumFigureCard({ figure, index }) {
  const [user] = useAuthState(auth);
  const [opening, setOpening] = useState(false);
  const navigate = useNavigate();

  const descriptor =
    figure.role ||
    figure.occupation ||
    figure.knownFor ||
    figure.title ||
    "Historical figure";

  const summary =
    figure.description ||
    figure.biography ||
    figure.bio ||
    figure.about ||
    "Explore the decisions, influences, and historical circumstances that shaped this life.";

  const period =
    figure.lifespan ||
    figure.years ||
    figure.dates ||
    figure.era ||
    [figure.birthYear, figure.deathYear].filter(Boolean).join("–");

  const place =
    figure.birthPlace ||
    figure.location ||
    figure.country ||
    figure.nationality ||
    "";

  const openConversation = async () => {
    if (opening) return;
    if (!user) {
      navigate("/signup");
      return;
    }

    setOpening(true);
    try {
      const botId = figure.id;
      const chatId = `${botId}_${figure.name.replace(/\s+/g, "_")}`;
      const chatRef = doc(db, "users", user.uid, "previousChats", chatId);
      const existingChat = await getDoc(chatRef);

      await setDoc(
        chatRef,
        {
          ...(existingChat.exists()
            ? {}
            : { img: figure.img, name: figure.name, character: botId }),
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );

      navigate(`/chat/${botId}/${figure.name}`);
    } catch (error) {
      console.error("Unable to open conversation:", error);
      setOpening(false);
    }
  };

  return (
    <article
      className="museum-figure-card"
      onClick={openConversation}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openConversation();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Begin a conversation with ${figure.name}`}
    >
      <div className="museum-figure-image">
        {figure.img ? (
          <img src={figure.img} alt={figure.name} loading="lazy" />
        ) : (
          <div className="museum-figure-placeholder">
            <UserRound aria-hidden="true" />
          </div>
        )}
        <span className="museum-object-number">
          EO / {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="museum-figure-caption">
        <div className="museum-figure-details">
          <p className="museum-figure-role">{descriptor}</p>
          <h3>{figure.name}</h3>
          {(period || place) && (
            <div className="museum-figure-metadata">
              {period && <span>{period}</span>}
              {place && <span>{place}</span>}
            </div>
          )}
          <p className="museum-figure-summary">{summary}</p>
          <span className="museum-figure-action">
            Enter conversation
          </span>
        </div>
        <span className="museum-card-arrow" aria-hidden="true">
          {opening ? <span className="museum-card-loader" /> : <ArrowUpRight />}
        </span>
      </div>
    </article>
  );
}

export default MuseumFigureCard;
