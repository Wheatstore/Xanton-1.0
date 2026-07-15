import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import Sidebar from "../sidebar/sidebar";

const starterPrompts = [
  "Describe the world you grew up in",
  "What decision changed your life?",
  "What do history books misunderstand?",
  "Who influenced you the most?",
];

const followUpPrompts = [
  "Tell me more",
  "How did that feel?",
  "What happened next?",
];

const firstDetail = (details, keys) =>
  keys.map((key) => details?.[key]).find((value) => value !== undefined && value !== null && value !== "") || "";

const normalizeNotes = (value) => {
  if (!value) return [];
  const entries = Array.isArray(value) ? value : [value];

  return entries
    .map((entry) => {
      if (typeof entry === "string") return { text: entry };
      if (!entry || typeof entry !== "object") return null;
      return {
        label: entry.label || entry.title || entry.year || entry.date || "",
        text: entry.text || entry.description || entry.fact || entry.event || entry.value || "",
      };
    })
    .filter((entry) => entry?.text);
};

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" aria-hidden="true">
      <path strokeLinecap="round" strokeWidth="1.8" d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 12 6-6 6 6M12 18V6" />
    </svg>
  );
}

function LogoMark() {
  return <img src="/images/logoTransparent.png" alt="Echoes of History" className="h-full w-full object-contain brightness-0" />;
}

function ChatWindow() {
  const params = useParams();
  const [user, authLoading] = useAuthState(auth);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [botName, setBotName] = useState("");
  const [botDetails, setBotDetails] = useState({});
  const [botProfilePicture, setBotProfilePicture] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [currentBotMessage, setCurrentBotMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendError, setSendError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const textareaRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const speakingTimerRef = useRef(null);

  useEffect(() => {
    if (authLoading) return undefined;

    let active = true;

    const loadBot = async () => {
      try {
        const botQuery = query(collection(db, "bots"), where("id", "==", params.id));
        const snapshot = await getDocs(botQuery);
        if (!active || snapshot.empty) return;

        const bot = snapshot.docs[0].data();
        setBotDetails(bot);
        setBotName(bot.name || "Historical figure");
        setBotProfilePicture(bot.img || "");
        setWelcomeMessage(bot.welcomeMessage || "");
        setCurrentBotMessage((current) => current || bot.welcomeMessage || "");
      } catch (error) {
        console.error("Error fetching bot data:", error);
      }
    };

    loadBot();
    return () => {
      active = false;
    };
  }, [authLoading, params.id]);

  useEffect(() => {
    if (authLoading || !user) return undefined;

    const messagesRef = collection(
      db,
      "users",
      user.uid,
      "characters",
      params.id,
      "messages"
    );
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

    return onSnapshot(messagesQuery, (snapshot) => {
      const nextMessages = snapshot.docs.map((messageDoc) => ({
        id: messageDoc.id,
        ...messageDoc.data(),
      }));

      setMessages(nextMessages);
      setLoadingMessages(false);

      const latestReply = [...nextMessages].reverse().find((message) => message.reply)?.reply;
      if (latestReply) setCurrentBotMessage(latestReply);
    });
  }, [authLoading, params.id, user]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendingMessage]);

  useEffect(
    () => () => {
      clearTimeout(speakingTimerRef.current);
    },
    []
  );

  const resizeTextarea = (textarea) => {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const fillPrompt = (prompt) => {
    setInput(prompt);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      resizeTextarea(textareaRef.current);
    });
  };

  const animateResponse = (reply) => {
    setIsSpeaking(true);
    clearTimeout(speakingTimerRef.current);
    speakingTimerRef.current = setTimeout(
      () => setIsSpeaking(false),
      Math.min(reply.length * 45, 9000)
    );
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const messageText = input.trim();
    if (!messageText || sendingMessage || !user) return;

    setSendingMessage(true);
    setSendError("");
    setInput("");
    resizeTextarea(textareaRef.current);

    try {
      const messagesRef = collection(
        db,
        "users",
        user.uid,
        "characters",
        params.id,
        "messages"
      );
      const messageDoc = await addDoc(messagesRef, {
        message: messageText,
        reply: null,
        sender: "user",
        timestamp: serverTimestamp(),
        pendingReply: true,
      });

      const response = await axios.post(
        `https://historia-backend-ycj7.onrender.com/api/chat/${user.uid}/${params.id}/${params.name}`,
        { message: messageText, messageId: messageDoc.id }
      );

      if (response?.data?.reply) {
        await updateDoc(
          doc(db, "users", user.uid, "characters", params.id, "messages", messageDoc.id),
          { reply: response.data.reply, pendingReply: false }
        );
        setCurrentBotMessage(response.data.reply);
        animateResponse(response.data.reply);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSendError("The archive could not reach this character. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  if (authLoading) {
    return (
      <div className="grid h-[100dvh] place-items-center bg-[#f5f2ec]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900" />
      </div>
    );
  }

  const hasConversation = messages.length > 0;
  const biography = firstDetail(botDetails, ["description", "biography", "bio", "about"]);
  const detailRows = [
    { label: "Born", value: firstDetail(botDetails, ["born", "birthDate", "dateOfBirth"]) },
    { label: "Died", value: firstDetail(botDetails, ["died", "deathDate", "dateOfDeath"]) },
    { label: "Known for", value: firstDetail(botDetails, ["role", "occupation", "knownFor", "title"]) },
    { label: "Place", value: firstDetail(botDetails, ["location", "birthPlace", "country"]) },
    { label: "Era", value: firstDetail(botDetails, ["era", "period", "century"]) },
  ].filter((detail) => detail.value);
  const archiveFacts = normalizeNotes(firstDetail(botDetails, ["facts", "keyFacts", "funFacts", "extraFacts"]));
  const keyMoments = normalizeNotes(firstDetail(botDetails, ["timeline", "keyMoments", "milestones"]));

  const factsPanel = (
    <div className="space-y-4">
      <section className="rounded-[22px] border border-stone-200 bg-white p-5 shadow-sm">
        <p className="mb-4 font-serif text-lg font-semibold text-stone-900">About {botName || "this figure"}</p>
        {biography ? (
          <p className="text-sm leading-6 text-stone-600">{biography}</p>
        ) : (
          <p className="text-sm leading-6 text-stone-500">{welcomeMessage || "Background information is being prepared for this archive."}</p>
        )}

        {detailRows.length > 0 && (
          <dl className="mt-5 divide-y divide-stone-100 border-t border-stone-100">
            {detailRows.map((detail) => (
              <div key={detail.label} className="grid grid-cols-[74px_1fr] gap-3 py-3 text-xs leading-5">
                <dt className="font-semibold text-stone-400">{detail.label}</dt>
                <dd className="text-stone-700">{String(detail.value)}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section className="rounded-[22px] border border-stone-200 bg-[#f2eee6] p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-serif text-base font-semibold text-stone-900">Archive notes</p>
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-400">Context</span>
        </div>
        <div className="space-y-4">
          {(archiveFacts.length > 0 ? archiveFacts : [{ text: welcomeMessage || currentBotMessage || "Ask a question to begin building context around this conversation." }]).slice(0, 4).map((fact, index) => (
            <div key={`${fact.label || "fact"}-${index}`} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-stone-900" />
              <div>
                {fact.label && <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">{fact.label}</p>}
                <p className="text-xs leading-5 text-stone-600">{fact.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {keyMoments.length > 0 && (
        <section className="rounded-[22px] border border-stone-200 bg-white p-5 shadow-sm">
          <p className="mb-4 font-serif text-base font-semibold text-stone-900">Key moments</p>
          <div className="relative space-y-4 before:absolute before:bottom-2 before:left-[3px] before:top-2 before:w-px before:bg-stone-200">
            {keyMoments.slice(0, 5).map((moment, index) => (
              <div key={`${moment.label || "moment"}-${index}`} className="relative grid grid-cols-[10px_48px_1fr] gap-2 text-xs leading-5">
                <span className="relative z-10 mt-1.5 h-2 w-2 rounded-full bg-stone-900 ring-4 ring-white" />
                <span className="font-semibold text-stone-400">{moment.label}</span>
                <span className="text-stone-700">{moment.text}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  return (
    <div className="archive-interface relative flex h-[100dvh] flex-col overflow-hidden bg-[#f5f2ec] text-[#282522]">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(226,217,202,.55), transparent 28%), radial-gradient(circle at 88% 78%, rgba(28,25,23,.055), transparent 30%)",
        }}
      />

      <div className="relative z-10 flex min-h-0 flex-1">
        <aside className="hidden w-[260px] flex-none border-r border-stone-200 bg-[#f1ede5] lg:block">
          <Sidebar
            activeCharacter={{ name: botName, image: botProfilePicture, description: biography }}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">

      <header className="relative z-20 flex h-16 flex-none items-center border-b border-stone-200/80 bg-white/80 px-4 backdrop-blur-xl sm:px-6 lg:h-[72px] lg:px-8">
        <div className="absolute bottom-0 left-0 h-px bg-stone-900 transition-all duration-700" style={{ width: `${Math.min(16 + messages.length * 8, 72)}%` }} />
        <button
          type="button"
          onClick={() => setSidebarVisible(true)}
          className="grid h-10 w-10 place-items-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm transition hover:border-stone-900 hover:text-stone-950 lg:hidden"
          aria-label="Open navigation"
        >
          <MenuIcon />
        </button>

        <div className="ml-4 flex min-w-0 items-center gap-3 lg:ml-0">
          <div className="hidden h-8 w-px bg-stone-200 sm:block" />
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-stone-950">Historia archive</p>
            <p className="truncate font-serif text-base font-semibold text-stone-800 sm:text-lg">Conversation with {botName || "history"}</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 rounded-full border border-stone-200 bg-[#faf8f4] px-3 py-1.5 text-[11px] font-medium text-stone-500">
          <span className={`h-1.5 w-1.5 rounded-full ${sendingMessage ? "animate-pulse bg-stone-400" : "bg-stone-950"}`} />
          <span className="hidden sm:inline">{sendingMessage ? "Composing" : "Present"}</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 gap-4 p-3 sm:p-4 lg:p-5">
        <aside className="hidden w-[270px] flex-none flex-col overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(70,55,40,0.08)] lg:flex 2xl:w-[310px]">
          <div className="relative min-h-0 flex-1 overflow-hidden bg-stone-200">
            {botProfilePicture ? (
              <img src={botProfilePicture} alt={botName} className={`h-full w-full object-cover transition duration-700 ${isSpeaking ? "scale-[1.025]" : "scale-100"}`} />
            ) : (
              <div className="grid h-full place-items-center bg-[#eee8df] p-24"><LogoMark /></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
            <div className="absolute right-5 top-5 h-12 w-12 rounded-full bg-white/80 p-2 opacity-80 shadow-sm backdrop-blur-md">
              <LogoMark />
            </div>
            <div className="absolute left-5 top-5 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700 backdrop-blur-md">
              Historical dossier
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/60">Now speaking with</p>
              <h1 className="font-serif text-4xl font-medium leading-none">{botName || "Historical figure"}</h1>
            </div>
          </div>

          <div className="flex-none p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Latest dispatch</span>
              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold text-stone-700">Archive open</span>
            </div>
            <p className="line-clamp-5 font-serif text-lg leading-relaxed text-stone-700">
              {currentBotMessage || welcomeMessage || "Begin the conversation to hear this figure's perspective."}
            </p>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-stone-200/90 bg-white/90 shadow-[0_20px_70px_rgba(70,55,40,0.08)] sm:rounded-[30px]">
          <div className="flex flex-none items-center gap-4 border-b border-stone-100 px-4 py-4 sm:px-6">
            <div className="relative h-12 w-12 flex-none overflow-hidden rounded-2xl bg-stone-100 lg:hidden">
              {botProfilePicture && <img src={botProfilePicture} alt="" className="h-full w-full object-cover" />}
            </div>
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.22em] text-stone-400">Folio 01 · oral history</p>
              <p className="font-serif text-lg font-semibold text-stone-800">The conversation</p>
              <p className="text-xs text-stone-400">Ask naturally. Follow a memory, decision, or moment in time.</p>
            </div>
            <div className="ml-auto hidden items-center gap-1.5 sm:flex" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-stone-900" />
              <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-stone-200" />
            </div>
            <span className="ml-2 hidden rounded-lg bg-[#f2eee6] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500 sm:block">
              Live transcript
            </span>
          </div>

          <details className="group flex-none border-b border-stone-100 bg-white 2xl:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3 text-xs font-semibold text-stone-700">
              <span>Facts &amp; information about {botName || "this figure"}</span>
              <span className="text-lg font-light transition group-open:rotate-45">+</span>
            </summary>
            <div className="custom-scrollbar max-h-[42vh] overflow-y-auto bg-[#f8f5ef] p-4">
              {factsPanel}
            </div>
          </details>

          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#fcfbf8] px-4 py-6 sm:px-8">
            {!hasConversation && !loadingMessages ? (
              <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center py-8 text-center">
                <div className="mb-6 grid h-16 w-16 place-items-center rounded-[22px] border border-stone-300 bg-white p-3 shadow-sm"><LogoMark /></div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-stone-950">An audience across time</p>
                <h2 className="mb-3 font-serif text-3xl font-medium tracking-tight text-stone-800 sm:text-4xl">Where would you like to begin?</h2>
                <p className="mb-8 max-w-lg text-sm leading-relaxed text-stone-500">Choose an opening question or write your own. The best conversations begin with curiosity, not trivia.</p>
                <div className="grid w-full gap-2 sm:grid-cols-2">
                  {starterPrompts.map((prompt, index) => (
                    <button
                      type="button"
                      key={prompt}
                      onClick={() => fillPrompt(prompt)}
                      className="group flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-left text-sm text-stone-600 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-900 hover:shadow-md"
                    >
                      <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-[#f1ede5] text-[10px] font-bold text-stone-950">0{index + 1}</span>
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl space-y-7">
                <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-300">
                  <span className="h-px flex-1 bg-stone-200" />
                  Conversation opened
                  <span className="h-px flex-1 bg-stone-200" />
                </div>

                {messages.map((message) => (
                  <div key={message.id} className="space-y-5">
                    {message.message && (
                      <div className="flex justify-end">
                        <div className="max-w-[88%] rounded-[22px] rounded-br-md bg-[#2e2b28] px-5 py-4 text-[15px] leading-relaxed text-white shadow-sm sm:max-w-[75%]">
                          {message.message}
                        </div>
                      </div>
                    )}

                    {message.reply && (
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-9 w-9 flex-none overflow-hidden rounded-xl bg-stone-200 shadow-sm">
                          {botProfilePicture ? <img src={botProfilePicture} alt="" className="h-full w-full object-cover" /> : <LogoMark />}
                        </div>
                        <div className="max-w-[88%] sm:max-w-[78%]">
                          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-950">{botName || "Historical figure"}</p>
                          <div className="rounded-[22px] rounded-tl-md border border-stone-200 bg-white px-5 py-4 text-[15px] leading-relaxed text-stone-700 shadow-sm">
                            {message.reply}
                          </div>
                        </div>
                      </div>
                    )}

                    {message.pendingReply && (
                      <div className="flex items-center gap-3 pl-1">
                        <div className="h-9 w-9 overflow-hidden rounded-xl bg-stone-200">
                          {botProfilePicture && <img src={botProfilePicture} alt="" className="h-full w-full object-cover opacity-70" />}
                        </div>
                        <div className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                          {[0, 1, 2].map((dot) => (
                            <span key={dot} className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-900" style={{ animationDelay: `${dot * 140}ms` }} />
                          ))}
                        </div>
                        <span className="text-xs italic text-stone-400">recollecting...</span>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={endOfMessagesRef} />
              </div>
            )}
          </div>

          <div className="flex-none border-t border-stone-100 bg-white p-3 sm:p-5">
            {hasConversation && !sendingMessage && (
              <div className="custom-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
                {followUpPrompts.map((prompt) => (
                  <button type="button" key={prompt} onClick={() => fillPrompt(prompt)} className="flex-none rounded-full border border-stone-200 bg-[#f8f5ef] px-3.5 py-1.5 text-xs text-stone-600 transition hover:border-stone-900 hover:text-stone-950">
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="relative">
              <div className="flex items-end gap-2 rounded-[22px] border border-stone-200 bg-[#f8f5ef] p-2 transition focus-within:border-stone-900 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(28,25,23,0.06)]">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    resizeTextarea(event.target);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${botName || "this figure"} something...`}
                  rows="1"
                  disabled={sendingMessage}
                  className="max-h-[120px] min-h-[44px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 disabled:opacity-60 sm:text-[15px]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sendingMessage}
                  className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-stone-950 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black disabled:translate-y-0 disabled:bg-stone-200 disabled:text-stone-400"
                  aria-label="Send message"
                >
                  {sendingMessage ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <ArrowIcon />}
                </button>
              </div>
            </form>
            <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-stone-400">
              <span>{sendError || "Historical portrayals may contain inaccuracies."}</span>
              <span className="hidden sm:inline">Enter to send · Shift + Enter for a new line</span>
            </div>
          </div>
        </section>

        <aside className="custom-scrollbar hidden w-[290px] flex-none overflow-y-auto 2xl:block">
          {factsPanel}
        </aside>
      </main>
        </div>
      </div>

      {isSidebarVisible && (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 h-full w-full bg-stone-900/25 backdrop-blur-sm" onClick={() => setSidebarVisible(false)} aria-label="Close navigation" />
          <div className="absolute inset-y-0 left-0 w-[min(88vw,360px)] border-r border-stone-200 bg-[#f1ede5] shadow-2xl animate-[drawer-in_.25s_ease-out]">
            <button type="button" onClick={() => setSidebarVisible(false)} className="absolute right-4 top-5 z-20 grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-white text-xl text-stone-500 shadow-sm hover:text-stone-950" aria-label="Close navigation">×</button>
            <Sidebar activeCharacter={{ name: botName, image: botProfilePicture, description: biography }} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes drawer-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(120, 113, 108, 0.2); border-radius: 999px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(120, 113, 108, 0.35); }

        .archive-interface {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .archive-interface .font-serif {
          font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
          letter-spacing: -0.018em;
        }

        .archive-interface .font-serif::first-letter {
          letter-spacing: 0;
        }
      `}</style>
    </div>
  );
}

export default ChatWindow;
