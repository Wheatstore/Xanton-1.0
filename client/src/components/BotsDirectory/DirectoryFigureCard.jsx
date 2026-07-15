/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, UserRound } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function DirectoryFigureCard({ figure }) {
  const [user] = useAuthState(auth);
  const [opening, setOpening] = useState(false);
  const [shouldLoadImage, setShouldLoadImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const imageContainerRef = useRef(null);
  const navigate = useNavigate();

  const role = figure.role || figure.occupation || figure.knownFor || figure.title || "Historical figure";
  const summary = figure.description || figure.biography || figure.bio || figure.about || "Discover this figure's life, ideas, and place in history through conversation.";
  const period = figure.lifespan || figure.years || figure.dates || figure.era || [figure.birthYear, figure.deathYear].filter(Boolean).join("–");
  const place = figure.birthPlace || figure.location || figure.country || figure.nationality || "";

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
    try {
      const chatId = `${figure.id}_${figure.name.replace(/\s+/g, "_")}`;
      const chatRef = doc(db, "users", user.uid, "previousChats", chatId);
      const existing = await getDoc(chatRef);
      await setDoc(chatRef, {
        ...(existing.exists() ? {} : { img: figure.img, name: figure.name, character: figure.id }),
        timestamp: serverTimestamp(),
      }, { merge: true });
      navigate(`/chat/${figure.id}/${figure.name}`);
    } catch (error) {
      console.error("Unable to open conversation:", error);
      setOpening(false);
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
        {place && <p className="bd-card-place"><MapPin />{place}</p>}
        <p className="bd-card-summary">{summary}</p>
        <button type="button" onClick={openConversation} disabled={opening}>
          {opening ? "Opening conversation…" : <>Start a conversation <ArrowRight /></>}
        </button>
      </div>
    </article>
  );
}
