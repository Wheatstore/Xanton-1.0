import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
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
import CharacterInfoPanel, { buildCharacterSections } from "../character-info/CharacterInfoPanel";

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

const explorationCopy = {
  overview: { title: "Life story", description: "Who they were" },
  conversationGuide: { title: "Talk with them", description: "Ideas to ask about" },
  timeline: { title: "Time trail", description: "Follow key moments" },
  context: { title: "Their world", description: "See the bigger picture" },
  ideas: { title: "Big ideas", description: "What they believed" },
  documents: { title: "Artifacts", description: "Read original records" },
  relationships: { title: "Their circle", description: "Meet important people" },
  controversies: { title: "The debates", description: "Explore difficult questions" },
  legacy: { title: "Their impact", description: "What they left behind" },
  sources: { title: "Evidence", description: "Check the sources" },
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
  const [isInformationPanelVisible, setInformationPanelVisible] = useState(false);
  const [activeInformationSection, setActiveInformationSection] = useState("overview");

  const textareaRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const speakingTimerRef = useRef(null);

  useEffect(() => {
    if (authLoading) return undefined;

    let active = true;

    const loadBot = async () => {
      try {
        const directSnapshot = await getDoc(doc(db, "bots", params.id));
        let bot = directSnapshot.exists() ? { id: directSnapshot.id, ...directSnapshot.data() } : null;

        if (!bot) {
          const botQuery = query(collection(db, "bots"), where("id", "==", params.id));
          const snapshot = await getDocs(botQuery);
          if (!snapshot.empty) bot = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        }

        if (!active || !bot) return;
        const resolvedName = bot.name || bot.profile?.fullName || params.name || "Historical figure";
        const resolvedWelcome = bot.welcomeMessage || bot.conversation?.welcomeMessage || "";
        setBotDetails(bot);
        setBotName(resolvedName);
        setBotProfilePicture(bot.img || bot.image || bot.profileImage || "");
        setWelcomeMessage(resolvedWelcome);
        setCurrentBotMessage((current) => current || resolvedWelcome);
      } catch (error) {
        console.error("Error fetching bot data:", error);
      }
    };

    loadBot();
    return () => {
      active = false;
    };
  }, [authLoading, params.id, params.name]);

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

  const informationSections = useMemo(() => buildCharacterSections(botDetails), [botDetails]);
  const informationSectionKey = informationSections.map((section) => section.id).join("|");

  useEffect(() => {
    if (!informationSections.length) return;
    if (!informationSections.some((section) => section.id === activeInformationSection)) {
      setActiveInformationSection(informationSections[0].id);
    }
  }, [activeInformationSection, informationSectionKey, informationSections]);

  if (authLoading) {
    return (
      <div className="grid h-[100dvh] place-items-center bg-[#f5f2ec]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900" />
      </div>
    );
  }

  const hasConversation = messages.length > 0;
  const biography = botDetails.biography?.short || botDetails.description || botDetails.bio || botDetails.about || "";
  const schemaPrompts = Array.isArray(botDetails.conversation?.suggestedQuestions) ? botDetails.conversation.suggestedQuestions : [];
  const openingPrompts = schemaPrompts.length ? schemaPrompts.slice(0, 4) : starterPrompts;
  const conversationFollowUps = schemaPrompts.length > 4 ? schemaPrompts.slice(4, 7) : followUpPrompts;
  const coreTopics = Array.isArray(botDetails.conversation?.coreTopics) ? botDetails.conversation.coreTopics.slice(0, 3) : [];
  const firstName = (botName || "this figure").split(" ")[0];
  const explorationStops = informationSections.map((section, index) => ({
    ...section,
    number: String(index + 1).padStart(2, "0"),
    ...(explorationCopy[section.id] || { title: section.label, description: "Explore this chapter" }),
  }));
  const activeExplorationStop = explorationStops.find((stop) => stop.id === activeInformationSection);
  const openInformationSection = (sectionId = activeInformationSection) => {
    setActiveInformationSection(sectionId);
    setInformationPanelVisible(true);
  };

  const factsPanel = (
    <CharacterInfoPanel
      details={botDetails}
      name={botName || "this figure"}
      sections={informationSections}
      activeTab={activeInformationSection}
      onTabChange={setActiveInformationSection}
    />
  );

  return (
    <div className="immersive-chat relative flex h-[100dvh] flex-col overflow-hidden bg-[#f4efe5] text-[#282522]">
      <div className="paper-texture pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">

      <header className="relative z-20 flex h-[68px] flex-none items-center border-b border-stone-900/10 bg-[#faf7f0]/95 px-3 backdrop-blur-xl sm:px-6">
        <button
          type="button"
          onClick={() => setSidebarVisible(true)}
          className="flex h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold text-stone-600 transition hover:bg-stone-900 hover:text-white"
          aria-label="Open conversations and navigation"
        >
          <MenuIcon />
          <span className="hidden sm:inline">My conversations</span>
        </button>

        <div className="absolute left-1/2 flex max-w-[45%] -translate-x-1/2 items-center gap-3">
          <div className="h-9 w-9 flex-none overflow-hidden rounded-full border border-stone-900/10 bg-stone-200">
            {botProfilePicture ? <img src={botProfilePicture} alt="" className="h-full w-full object-cover" /> : <LogoMark />}
          </div>
          <div className="min-w-0">
            <p className="truncate font-serif text-sm font-semibold text-stone-800 sm:text-base">{botName || "Historical figure"}</p>
            <p className="hidden truncate text-[10px] text-stone-400 sm:block">A conversation across time</p>
          </div>
        </div>

        {informationSections.length > 0 && (
          <button type="button" onClick={() => openInformationSection()} className="ml-auto flex items-center gap-2 rounded-full bg-[#a34c35] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-stone-900 sm:px-4">
            <span>Explore {firstName}</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/20 px-1 text-[9px]">{informationSections.length}</span>
          </button>
        )}
      </header>

      {explorationStops.length > 0 && (
        <section className="relative z-20 flex flex-none items-stretch gap-2 border-b border-stone-900/10 bg-[#eee5d6] px-2 py-2 sm:px-3">
          <button type="button" onClick={() => openInformationSection()} className="group hidden w-[230px] flex-none flex-col justify-center rounded-[20px] border border-stone-900/10 bg-white/35 px-5 text-left transition hover:bg-[#fffaf1] md:flex xl:w-[280px] xl:px-7">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#a34c35]">Beyond the conversation</span>
            <span className="mt-1 flex items-center gap-2 whitespace-nowrap font-serif text-base text-stone-900 xl:text-lg">Explore their world <span className="transition group-hover:translate-x-1">→</span></span>
          </button>
          <div className="custom-scrollbar flex min-w-0 flex-1 items-stretch gap-2 overflow-x-auto">
            <div className="flex w-28 flex-none flex-col justify-center px-3 md:hidden">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a34c35]">Explore</span>
              <span className="font-serif text-sm">Their world</span>
            </div>
            {explorationStops.map((stop) => (
              <button
                type="button"
                key={stop.id}
                onClick={() => openInformationSection(stop.id)}
                className="group relative flex w-[150px] flex-none items-center gap-3 rounded-[20px] border border-stone-900/10 bg-white/25 px-4 py-3 text-left transition hover:bg-[#fffaf1] sm:w-[170px]"
                aria-label={`Explore ${stop.title}: ${stop.description}`}
              >
                <span className="font-serif text-xl text-stone-400 transition group-hover:text-[#a34c35]">{stop.number}</span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold text-stone-800">{stop.title}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-stone-500">{stop.description}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <main
        className={`relative z-10 mx-auto grid min-h-0 w-full max-w-[1600px] flex-1 gap-3 p-3 transition-[grid-template-columns,grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-4 sm:p-4 ${
          isInformationPanelVisible
            ? "grid-rows-[minmax(0,1fr)_minmax(0,0.85fr)] lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)] lg:grid-rows-1 xl:grid-cols-[minmax(280px,0.62fr)_minmax(440px,1fr)_minmax(360px,0.72fr)]"
            : "grid-rows-[minmax(0,1fr)_0px] lg:grid-cols-[minmax(0,1fr)_0px] lg:grid-rows-1 xl:grid-cols-[minmax(320px,0.8fr)_minmax(560px,1.2fr)_0px]"
        }`}
      >
        <aside className="living-portrait relative hidden min-h-0 overflow-hidden rounded-[32px] border border-stone-900/10 shadow-[0_18px_50px_rgba(75,57,39,0.1)] xl:flex xl:flex-col">
          <div className="absolute inset-0 overflow-hidden bg-stone-200">
            {botProfilePicture ? (
              <img src={botProfilePicture} alt={botName} className={`h-full w-full object-cover transition duration-[1800ms] ${isSpeaking ? "scale-[1.035]" : "scale-100"}`} />
            ) : (
              <div className="grid h-full place-items-center bg-[#eee8df] p-24"><LogoMark /></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/15 to-transparent" />
          </div>

          <div className="relative mt-auto p-10 text-white">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">You have entered their world</p>
            <h1 className="font-serif text-5xl leading-[0.94]">{botName || "A voice from history"}</h1>
            {botDetails.profile?.subtitle && <p className="mt-4 max-w-md text-sm leading-6 text-white/70">{botDetails.profile.subtitle}</p>}
            <blockquote className="mt-7 border-l border-[#d16b4b] pl-5 font-serif text-lg italic leading-7 text-white/90">
              “{currentBotMessage || welcomeMessage || "Ask me about the world as I knew it."}”
            </blockquote>
            {coreTopics.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {coreTopics.map((topic) => (
                  <button type="button" key={topic} onClick={() => fillPrompt(`Tell me about ${topic}`)} className="rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white hover:text-stone-950">{topic}</button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <section className="conversation-book flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-stone-900/10 bg-[#fffdf8] shadow-[0_18px_50px_rgba(75,57,39,0.08)] sm:rounded-[32px]">
          <div className="flex flex-none items-center gap-4 border-b border-stone-900/10 px-4 py-3 xl:hidden">
            <div className="relative h-14 w-14 flex-none overflow-hidden rounded-[18px] bg-stone-100">
              {botProfilePicture && <img src={botProfilePicture} alt="" className="h-full w-full object-cover" />}
            </div>
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.22em] text-stone-400">Folio 01 · oral history</p>
              <p className="font-serif text-lg font-semibold text-stone-800">Letters across time</p>
              <p className="line-clamp-1 text-xs text-stone-400">Write from the present. Receive a reply from history.</p>
            </div>
          </div>

          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#fffdf8] px-4 py-6 sm:px-8 lg:px-12">
            {loadingMessages ? (
              <div className="grid h-full place-items-center">
                <p className="animate-pulse font-serif text-stone-400">Opening the story…</p>
              </div>
            ) : !hasConversation ? (
              <div className="mx-auto flex h-full max-w-xl flex-col justify-center py-8">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#a34c35]">Your visit begins here</p>
                <h2 className="font-serif text-4xl font-medium leading-tight text-stone-900 sm:text-5xl">Send a letter into the past.</h2>
                <p className="mb-8 mt-4 max-w-md text-sm leading-6 text-stone-500">Choose an opening thought or write your own. Your letter will become the beginning of a historical correspondence.</p>
                <div className="w-full space-y-1">
                  {openingPrompts.map((prompt, index) => (
                    <button
                      type="button"
                      key={prompt}
                      onClick={() => fillPrompt(prompt)}
                      className="group flex w-full items-center gap-4 border-b border-stone-900/10 py-4 text-left font-serif text-lg text-stone-700 transition hover:pl-2 hover:text-[#a34c35]"
                    >
                      <span className="text-[10px] font-bold tracking-widest text-stone-400">0{index + 1}</span>
                      <span>{prompt}</span>
                      <span className="ml-auto transition group-hover:translate-x-1">→</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-2xl space-y-10">
                <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-300">
                  <span className="h-px flex-1 bg-stone-200" />
                  Correspondence across time
                  <span className="h-px flex-1 bg-stone-200" />
                </div>

                {messages.map((message, messageIndex) => (
                  <article key={message.id} className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-4 rounded-[26px] border border-stone-900/10 bg-[#fbf7ef] p-4 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-6 sm:rounded-[30px] sm:p-6">
                    <aside aria-hidden="true" className="pt-1 text-center">
                      <p className="font-serif text-2xl text-[#a34c35]">{String(messageIndex + 1).padStart(2, "0")}</p>
                      <div className="mx-auto mt-3 h-12 w-px bg-stone-300" />
                    </aside>
                    <div className="min-w-0 space-y-7">
                      {message.message && (
                        <div className="relative rounded-[22px] border border-stone-900/10 bg-white/65 p-4">
                          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.24em] text-stone-400">Sent from the present</p>
                          <p className="handwritten-note text-lg leading-8 text-stone-600 sm:text-xl">Dear {firstName}, &nbsp;{message.message}</p>
                        </div>
                      )}

                      {message.reply && (
                        <div className="letter-paper relative overflow-hidden rounded-[24px] border border-[#d8cbb8] px-5 py-6 shadow-[0_12px_30px_rgba(75,57,39,0.08)] sm:rounded-[28px] sm:px-7 sm:py-8">
                          <div className="absolute right-4 top-4 grid h-10 w-10 rotate-6 place-items-center rounded-full border border-[#a34c35]/35 text-[8px] font-bold uppercase tracking-widest text-[#a34c35]/60">Reply</div>
                          <p className="mb-5 flex items-center gap-3 pr-12 text-[9px] font-bold uppercase tracking-[0.24em] text-[#a34c35]"><span className="h-px w-7 bg-[#a34c35]" />A letter from {botName || "the historical record"}</p>
                          <p className="memory-response font-serif text-xl leading-[1.75] text-stone-800 sm:text-[22px]">{message.reply}</p>
                        </div>
                      )}

                      {message.pendingReply && (
                        <div className="flex items-center gap-3 pb-3 text-sm italic text-stone-400">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-[#bd5b40]" />
                          A reply is being written across time…
                        </div>
                      )}
                    </div>
                  </article>
                ))}
                <div ref={endOfMessagesRef} />
              </div>
            )}
          </div>

          <div className="flex-none border-t border-stone-900/10 bg-[#faf7f0] p-3 sm:px-8 sm:py-4 lg:px-12">
            {hasConversation && !sendingMessage && (
              <div className="custom-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
                {conversationFollowUps.map((prompt) => (
                  <button type="button" key={prompt} onClick={() => fillPrompt(prompt)} className="flex-none rounded-full border border-stone-200 bg-[#f8f5ef] px-3.5 py-1.5 text-xs text-stone-600 transition hover:border-stone-900 hover:text-stone-950">
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="relative">
              <div className="letter-composer relative rounded-[24px] border border-[#d7cab8] bg-[#fffdf8] px-4 pb-2 pt-3 shadow-[0_8px_24px_rgba(75,57,39,0.06)] transition focus-within:border-[#a34c35] focus-within:shadow-[0_10px_30px_rgba(75,57,39,0.12)] sm:rounded-[28px]">
                <div className="mb-1 flex items-center gap-2 border-b border-stone-900/10 pb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  <span>To: {botName || "History"}</span>
                  <span className="ml-auto">From: The present</span>
                </div>
                <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    resizeTextarea(event.target);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={`Dear ${firstName}, I have always wondered…`}
                  rows="1"
                  disabled={sendingMessage}
                  className="handwritten-note max-h-[120px] min-h-[44px] flex-1 resize-none bg-transparent px-1 py-3 text-base text-stone-800 outline-none placeholder:text-stone-400 disabled:opacity-60 sm:text-lg"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sendingMessage}
                  className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[#a34c35] text-white transition hover:scale-105 hover:bg-stone-900 disabled:scale-100 disabled:bg-stone-200 disabled:text-stone-400"
                  aria-label="Send letter"
                >
                  {sendingMessage ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <ArrowIcon />}
                </button>
                </div>
              </div>
            </form>
            <p className="mt-2 px-1 text-[10px] text-stone-400">{sendError || "This is a historical interpretation. Important facts should be verified."}</p>
          </div>
        </section>

        {informationSections.length > 0 && (
          <aside
            aria-hidden={!isInformationPanelVisible}
            className={`research-desk flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[28px] border-stone-900/10 bg-[#f5f2ec] shadow-[0_18px_50px_rgba(75,57,39,0.08)] transition-[opacity,transform,visibility] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-[32px] ${
              isInformationPanelVisible
                ? "visible translate-x-0 border opacity-100 delay-150"
                : "pointer-events-none invisible translate-x-6 border-0 opacity-0 delay-500"
            }`}
          >
            <div className="flex flex-none items-center gap-3 border-b border-stone-200 bg-white px-4 py-3 sm:px-5 sm:py-4">
              <div className="h-10 w-10 flex-none overflow-hidden rounded-xl bg-stone-200 sm:h-11 sm:w-11">
                {botProfilePicture ? <img src={botProfilePicture} alt="" className="h-full w-full object-cover" /> : <LogoMark />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a34c35]">Research desk · {botName}</p>
                <p className="truncate font-serif text-base font-semibold text-stone-900 sm:text-lg">{activeExplorationStop?.title || "Life story"}</p>
              </div>
              <button type="button" onClick={() => setInformationPanelVisible(false)} className="grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-[#f8f5ef] text-lg text-stone-500 transition hover:border-stone-900 hover:text-stone-950" aria-label="Close research desk">×</button>
            </div>
            <div className="hidden flex-none border-b border-stone-200 bg-[#f8f5ef] px-5 py-3 sm:block">
              <p className="text-xs leading-5 text-stone-500">{activeExplorationStop?.description || "Choose a chapter and discover more."} Keep this desk open while you continue the conversation.</p>
            </div>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
              {factsPanel}
            </div>
          </aside>
        )}

      </main>
      </div>

      {isSidebarVisible && (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 h-full w-full bg-stone-900/25 backdrop-blur-sm" onClick={() => setSidebarVisible(false)} aria-label="Close navigation" />
          <div className="absolute inset-y-0 left-0 w-[min(88vw,360px)] border-r border-stone-200 bg-[#f1ede5] shadow-2xl animate-[drawer-in_.25s_ease-out]">
            <button type="button" onClick={() => setSidebarVisible(false)} className="absolute right-4 top-5 z-20 grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-white text-xl text-stone-500 shadow-sm hover:text-stone-950" aria-label="Close navigation">×</button>
            <Sidebar
              activeCharacter={{ name: botName, image: botProfilePicture, description: biography }}
              informationSections={informationSections}
              activeInformationSection={activeInformationSection}
              onInformationSectionChange={(sectionId) => {
                setActiveInformationSection(sectionId);
                setSidebarVisible(false);
                setInformationPanelVisible(true);
              }}
            />
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

        .immersive-chat {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .immersive-chat .font-serif {
          font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
          letter-spacing: -0.018em;
        }

        .immersive-chat .font-serif::first-letter {
          letter-spacing: 0;
        }

        .memory-response::first-letter {
          float: left;
          margin: 0.08em 0.12em 0 0;
          color: #a34c35;
          font-size: 3.2em;
          line-height: 0.78;
        }

        .handwritten-note {
          font-family: "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive;
          letter-spacing: -0.025em;
        }

        .letter-paper,
        .letter-composer {
          background-color: #fffdf8;
          background-image:
            linear-gradient(90deg, transparent 0, transparent 24px, rgba(163, 76, 53, 0.08) 25px, transparent 26px),
            repeating-linear-gradient(0deg, transparent 0, transparent 27px, rgba(82, 71, 58, 0.055) 28px);
        }

        .paper-texture {
          opacity: 0.28;
          background-image: radial-gradient(rgba(71, 60, 45, 0.15) 0.55px, transparent 0.55px);
          background-size: 5px 5px;
          mix-blend-mode: multiply;
        }

        @media (prefers-reduced-motion: reduce) {
          .immersive-chat *, .immersive-chat *::before, .immersive-chat *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatWindow;
