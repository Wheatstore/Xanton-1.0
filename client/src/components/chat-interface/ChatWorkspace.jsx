/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, BookOpen, ChevronRight, History, Menu, MessageCircle, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { ArchiveBrand } from "../navbar/navbar";
import { buildCharacterSections } from "./character-info/CharacterInfoPanel";
import HistoricalExperience from "./character-info/HistoricalExperience";
import useDialogFocus from "./useDialogFocus";
import "./workspace.css";

const sectionLabels = { overview: "Life story", timeline: "Timeline", context: "Their world", ideas: "Ideas & beliefs", documents: "Documents", relationships: "People", controversies: "Debates", legacy: "Legacy", sources: "Sources", conversationGuide: "Questions to ask" };
const starters = ["What decision changed your life?", "Describe the world you grew up in.", "What do people misunderstand about you?"];

function inlineText(text) {
  return String(text).split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function MessageText({ text }) {
  return <div className="cw-message-text">{String(text || "").split(/\n{2,}/).filter(block => block.trim()).map((block, index) => {
    const lines = block.split("\n").filter(line => line.trim());
    if (lines.every(line => /^\s*[-•*]\s+/.test(line))) return <ul key={index}>{lines.map((line, i) => <li key={i}>{inlineText(line.replace(/^\s*[-•*]\s+/, ""))}</li>)}</ul>;
    if (lines.every(line => /^\s*\d+[.)]\s+/.test(line))) return <ol key={index}>{lines.map((line, i) => <li key={i}>{inlineText(line.replace(/^\s*\d+[.)]\s+/, ""))}</li>)}</ol>;
    return <p key={index}>{lines.map((line, i) => <span key={i}>{inlineText(line)}{i < lines.length - 1 && <br />}</span>)}</p>;
  })}</div>;
}

export default function ChatWorkspace({ details = {}, name, image, welcomeMessage, messages = [], loading = false, loadError = "", sending = false, sendError = "", onSend, navigation }) {
  const [mode, setMode] = useState("conversation");
  const [section, setSection] = useState("overview");
  const [draft, setDraft] = useState("");
  const [drawer, setDrawer] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [introExpanded, setIntroExpanded] = useState(false);
  const [atLatest, setAtLatest] = useState(true);
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);
  const dialogRef = useRef(null);
  const drawerTriggerRef = useRef(null);
  const followMessagesRef = useRef(true);
  const readingPositionRef = useRef(0);
  const closeDrawer = useCallback(() => setDrawer(null), []);
  useDialogFocus(drawer, dialogRef, closeDrawer, drawerTriggerRef);

  const sections = useMemo(() => {
    const order = ["overview", "timeline", "ideas", "documents", "relationships", "context", "controversies", "legacy", "sources", "conversationGuide"];
    return buildCharacterSections(details).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }, [details]);
  const activeSection = sections.some(item => item.id === section) ? section : sections[0]?.id;
  const hasSources = sections.some(item => item.id === "sources");
  const biography = details.biography?.short || details.description || details.bio || "";
  const subtitle = details.profile?.subtitle || details.role || details.occupation || "A voice from history";
  const intro = welcomeMessage || biography || `Ask ${name || "this figure"} about their life, ideas, and the world they knew.`;
  const questions = (Array.isArray(details.conversation?.suggestedQuestions) && details.conversation.suggestedQuestions.length ? details.conversation.suggestedQuestions : starters).slice(0, 3);
  const composerDisabled = sending || loading || Boolean(loadError);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (mode !== "conversation" || !scroller) return;
    // Preserve the reader's position when a reply arrives or they return from history.
    scroller.scrollTo({ top: messages.length ? (followMessagesRef.current ? scroller.scrollHeight : readingPositionRef.current) : 0, behavior: "auto" });
  }, [messages, sending, mode]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
    }
  }, [draft, mode]);

  const openDrawer = (kind, event) => {
    drawerTriggerRef.current = event.currentTarget;
    setDrawer(kind);
  };
  const changeMode = nextMode => {
    setMode(nextMode);
    closeDrawer();
  };
  const explore = id => {
    setSection(id);
    changeMode("history");
  };
  const ask = question => {
    changeMode("conversation");
    setDraft(question);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };
  const jumpToLatest = () => {
    followMessagesRef.current = true;
    setAtLatest(true);
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };
  const submit = async event => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || composerDisabled || !onSend) return;
    followMessagesRef.current = true;
    setDraft("");
    if (await onSend(text) === false) setDraft(text);
  };

  const characterNavigation = <div className="cw-side-content">
    <Link to="/" className="cw-brand" aria-label="Echoes of History home"><ArchiveBrand /></Link>
    <Link to="/bots" className="cw-collection-link"><ArrowLeft size={16} />All historical figures</Link>
    <div className="cw-profile-card">
      <div className="cw-profile-portrait">{image ? <img src={image} alt="" /> : <BookOpen size={32} />}</div>
      <p className="cw-eyebrow">Your conversation with</p>
      <h2>{name || "Historical figure"}</h2>
      <p className="cw-profile-subtitle">{subtitle}</p>
    </div>
    <nav className="cw-side-modes" aria-label="Character workspace">
      <button type="button" className={mode === "conversation" ? "is-active" : ""} aria-current={mode === "conversation" ? "page" : undefined} onClick={() => changeMode("conversation")}><MessageCircle size={18} />Conversation</button>
      {sections.length > 0 && <button type="button" className={mode === "history" ? "is-active" : ""} aria-current={mode === "history" ? "page" : undefined} onClick={() => changeMode("history")}><BookOpen size={18} />Explore history<ChevronRight size={14} /></button>}
    </nav>
    {mode === "history" && <nav className="cw-side-chapters" aria-label="Historical topics">
      {sections.map(item => <button type="button" key={item.id} aria-current={activeSection === item.id ? "page" : undefined} onClick={() => explore(item.id)}>{sectionLabels[item.id] || item.label}</button>)}
    </nav>}
    <div className="cw-side-footer">
      {hasSources && <button type="button" onClick={() => explore("sources")}><BookOpen size={15} />Sources & references<ArrowUpRight size={14} /></button>}
      <p>History invites a conversation.</p>
    </div>
  </div>;

  return <div className={`immersive-chat cw-workspace${sidebarCollapsed ? " is-focused" : ""}${mode === "history" ? " is-history" : ""}`}>
    <aside id="character-navigation" className="cw-sidebar" aria-label="Character navigation" inert={drawer ? "" : undefined} aria-hidden={Boolean(drawer) || undefined}>{characterNavigation}</aside>
    <div className="cw-main" inert={drawer ? "" : undefined} aria-hidden={Boolean(drawer) || undefined}>
      <header className="cw-room-header">
        <button type="button" className="cw-icon-button cw-navigation-desktop" onClick={() => setSidebarCollapsed(value => !value)} aria-label={sidebarCollapsed ? "Show navigation" : "Hide navigation"} title={sidebarCollapsed ? "Show navigation" : "Hide navigation"} aria-expanded={!sidebarCollapsed} aria-controls="character-navigation">{sidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}</button>
        <button type="button" className="cw-icon-button cw-navigation-mobile" onClick={event => openDrawer("navigation", event)} aria-label="Open character navigation" aria-haspopup="dialog" aria-expanded={drawer === "navigation"}><Menu size={20} /></button>
        <div className="cw-header-portrait">{image ? <img src={image} alt="" /> : <BookOpen size={20} />}</div>
        <div className="cw-room-title"><h1>{name || "Historical figure"}</h1><p>{mode === "history" ? "Explore a life and its world" : "A conversation across time"}</p></div>
        <button type="button" className="cw-recent" onClick={event => openDrawer("conversations", event)} aria-label="My conversations" aria-haspopup="dialog" aria-expanded={drawer === "conversations"}><History size={18} /><span>My conversations</span></button>
      </header>
      <nav className="cw-mobile-modes" aria-label="Conversation views">
        <button type="button" aria-pressed={mode === "conversation"} onClick={() => changeMode("conversation")}><MessageCircle size={16} />Conversation</button>
        {sections.length > 0 && <button type="button" aria-pressed={mode === "history"} onClick={() => changeMode("history")}><BookOpen size={16} />Explore history</button>}
      </nav>

      {mode === "conversation" ? <main className="cw-conversation" aria-label={`Conversation with ${name}`}>
        <div className="cw-reading-area">
        <div className="cw-scroll" ref={scrollRef} tabIndex={0} aria-label="Conversation messages" onScroll={event => {
          const scroller = event.currentTarget;
          const nearBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 80;
          followMessagesRef.current = nearBottom;
          readingPositionRef.current = scroller.scrollTop;
          setAtLatest(nearBottom);
        }}>
          {loadError ? <div className="cw-state" role="alert"><h2>We couldn’t open this conversation.</h2><p>{loadError}</p><Link to="/bots">Return to the collection<ArrowLeft size={15} /></Link></div> : loading ? <p className="cw-state" role="status">Opening your conversation…</p> : messages.length === 0 ? <div className="cw-welcome">
            <div className="cw-welcome-intro">
              <div className="cw-welcome-heading"><p className="cw-eyebrow">History begins with a question</p><h2>What would you<br className="cw-desktop-break" /> like to ask?</h2></div>
              <figure className="cw-welcome-art"><img src="/images/chat-writing-room.webp" alt="A painted writing desk overlooking a sunlit garden" /><figcaption>Illustrative artwork</figcaption></figure>
            </div>
            <div className="cw-introduction"><p className={`cw-welcome-copy${introExpanded || intro.length <= 260 ? " is-expanded" : ""}`}>{intro}</p>{intro.length > 260 && <button type="button" aria-expanded={introExpanded} onClick={() => setIntroExpanded(value => !value)}>{introExpanded ? "Show less" : "Read introduction"}</button>}</div>
            <div className="cw-starter-heading"><p>Start with a little curiosity</p>{sections.length > 0 && <button type="button" onClick={() => explore("overview")}>Explore their story<ArrowUpRight size={14} /></button>}</div>
            <div className="cw-starters" aria-label="Suggested opening questions">{questions.map(question => <button type="button" key={question} onClick={() => ask(question)}><span>{question}</span><ArrowUpRight size={18} /></button>)}</div>
          </div> : <div className="cw-thread">
            <p className="cw-thread-start">A conversation with {name}</p>
            {messages.map((message, index) => <article className="cw-exchange" key={message.id || index}>
              {message.message && <div className="cw-question"><p className="cw-message-author">You</p><MessageText text={message.message} /></div>}
              {message.reply && <div className="cw-answer"><div className="cw-answer-avatar">{image ? <img src={image} alt="" /> : <BookOpen size={20} />}</div><div><p className="cw-message-author">{name}</p><MessageText text={message.reply} /></div></div>}
              {message.pendingReply && !message.reply && <p className="cw-writing" role="status"><span />{name} is composing a reply…</p>}
              {message.replyError && !message.reply && <p className="cw-reply-error">This reply couldn’t be completed. Please send your question again.</p>}
            </article>)}
          </div>}
        </div>
        {messages.length > 0 && !atLatest && <button type="button" className="cw-jump-latest" onClick={jumpToLatest}><ArrowDown size={16} />Latest messages</button>}
        </div>
        <div className="cw-composer-area">
          {messages.length > 0 && !sending && !loadError && <div className="cw-followups" aria-label="Follow-up questions">{["Tell me more", "What happened next?"].map(prompt => <button type="button" key={prompt} onClick={() => ask(prompt)}>{prompt}<ArrowUpRight size={13} /></button>)}</div>}
          <form onSubmit={submit} className="cw-composer">
            <label className="sr-only" htmlFor="character-message">Your message to {name}</label>
            <textarea id="character-message" ref={textareaRef} value={draft} onChange={event => setDraft(event.target.value)} placeholder={`Ask ${name || "a question"}…`} rows={2} disabled={composerDisabled} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form.requestSubmit(); } }} />
            <div className="cw-composer-toolbar"><span>Enter to send <span aria-hidden="true">·</span> Shift + Enter for a new line</span><button type="submit" disabled={!draft.trim() || composerDisabled} aria-label="Send message">{sending ? <><span className="cw-spinner" />Sending</> : <>Send message<ArrowUp size={18} /></>}</button></div>
          </form>
          {sendError && <p className="cw-send-error" role="alert">{sendError}</p>}
          <p className="cw-disclosure">AI historical portrayal. {hasSources ? <button type="button" onClick={() => explore("sources")}>Check the sources.</button> : "Verify important facts with historical sources."}</p>
        </div>
      </main> : <main className="cw-history" aria-label={`Explore ${name}'s history`}>
        <div className="cw-history-toolbar"><button type="button" onClick={() => changeMode("conversation")}><ArrowLeft size={16} />Back to conversation</button><label>Chapter<select value={activeSection || ""} onChange={event => setSection(event.target.value)}>{sections.map(item => <option key={item.id} value={item.id}>{sectionLabels[item.id] || item.label}</option>)}</select></label></div>
        <div className="cw-history-content" tabIndex={0} aria-label="Historical chapter"><HistoricalExperience key={activeSection} sectionId={activeSection} details={details} name={name} onAsk={ask} onExplore={explore} onBack={sections.some(item => item.id === "overview") && activeSection !== "overview" ? () => setSection("overview") : undefined} /></div>
      </main>}
    </div>

    {drawer && <div className="cw-drawer-backdrop" onClick={event => { if (event.target === event.currentTarget) closeDrawer(); }}><aside ref={dialogRef} className={`cw-drawer${drawer === "navigation" ? " cw-drawer-navigation" : ""}`} role="dialog" aria-modal="true" aria-label={drawer === "navigation" ? "Character navigation" : "My conversations"}><button type="button" className="cw-drawer-close" onClick={closeDrawer} aria-label={drawer === "navigation" ? "Close navigation" : "Close conversations"}><X size={20} /></button>{drawer === "navigation" ? characterNavigation : navigation}</aside></div>}
  </div>;
}
