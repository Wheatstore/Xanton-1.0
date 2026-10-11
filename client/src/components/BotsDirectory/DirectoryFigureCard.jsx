/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, UserRound } from "lucide-react";
import { useArchiveAuth } from "../../hooks/useArchiveAuth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { normalizeFigure } from "./figureData";
import "./collection.css";

export default function DirectoryFigureCard({ figure }) {
  const [user] = useArchiveAuth(auth);
  const [opening, setOpening] = useState(false);
  const [openError, setOpenError] = useState("");
  const [shouldLoadImage, setShouldLoadImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const imageContainerRef = useRef(null);
  const navigate = useNavigate();

  figure = normalizeFigure(figure);
  const { role, period } = figure;
  const summary = figure.description || "Discover their life, ideas, and the world they knew.";

  useEffect(() => {
    const imageContainer = imageContainerRef.current;
    if (!imageContainer || !figure.img) return undefined;

    if (!("IntersectionObserver" in window)) {
      setShouldLoadImage(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadImage(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px", threshold: 0.01 }
    );

    observer.observe(imageContainer);
    return () => observer.disconnect();
  }, [figure.img]);

  const openConversation = async () => {
    if (opening) return;
    if (!user) { navigate("/signup"); return; }
    setOpening(true);
    setOpenError("");
    try {
      const chatId = `${figure.id}_${figure.name.replace(/\s+/g, "_")}`;
      const chatRef = doc(db, "users", user.uid, "previousChats", chatId);
      const existing = await getDoc(chatRef);
      await setDoc(chatRef, {
        ...(existing.exists() ? {} : { img: figure.img, name: figure.name, character: figure.id }),
        timestamp: serverTimestamp(),
      }, { merge: true });
      navigate(`/chat/${encodeURIComponent(figure.id)}/${encodeURIComponent(figure.name)}`);
    } catch (error) {
      console.error("Unable to open conversation:", error);
      setOpening(false);
      setOpenError("Couldn’t open the conversation. Please try again.");
    }
  };

  return (
    <article className="bd-card">
      <div className="bd-card-image" ref={imageContainerRef}>
        {figure.img && !imageLoaded && !imageFailed && <div className="bd-image-shimmer" aria-hidden="true" />}
        {figure.img && shouldLoadImage && !imageFailed ? (
          <img
            src={figure.img}
            alt={figure.name}
            loading="lazy"
            decoding="async"
            className={imageLoaded ? "is-loaded" : ""}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
          />
        ) : null}
        {(!figure.img || imageFailed) && <div className="bd-card-placeholder"><UserRound /></div>}
        {period && <span className="bd-card-period">{period}</span>}
      </div>
      <div className="bd-card-content">
        <p className="bd-card-role">{role}</p>
        <h2>{figure.name}</h2>
        <p className="bd-card-summary">{summary}</p>
        <button type="button" onClick={openConversation} disabled={opening} aria-label={`Start a conversation with ${figure.name}`}>
          {opening ? "Opening…" : <>Start conversation <ArrowRight /></>}
        </button>
        {openError && <p className="bd-card-error" role="alert">{openError}</p>}
      </div>
    </article>
  );
}
