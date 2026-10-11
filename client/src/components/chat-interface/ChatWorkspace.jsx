/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUp, BookOpen, History, MessageCircle, X } from "lucide-react";
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);
  const dialogRef = useRef(null);
  const drawerTriggerRef = useRef(null);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  useDialogFocus(drawerOpen, dialogRef, closeDrawer, drawerTriggerRef);
  const sections = useMemo(() => buildCharacterSections(details), [details]);
  const activeSection = sections.some(item => item.id === section) ? section : sections[0]?.id;
  const biography = details.biography?.short || details.description || details.bio || "";
  const subtitle = details.profile?.subtitle || details.role || details.occupation || "A conversation across time";
  const questions = (Array.isArray(details.conversation?.suggestedQuestions) && details.conversation.suggestedQuestions.length ? details.conversation.suggestedQuestions : starters).slice(0, 3);

  useEffect(() => {
    if (mode === "conversation" && scrollRef.current) scrollRef.current.scrollTo({ top: messages.length ? scrollRef.current.scrollHeight : 0, behavior: "smooth" });
  }, [messages, sending, mode]);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) { textarea.style.height = "auto"; textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`; }
  }, [draft, mode]);

  const ask = question => {
    setMode("conversation"); setDraft(question);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };
  const submit = async event => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || sending || !onSend) return;
    setDraft("");
    if (await onSend(text) === false) setDraft(text);
  };
  const explore = id => { setSection(id); setMode("history"); };

  return <div className="immersive-chat cw-workspace">
    <header className="cw-topbar" inert={drawerOpen ? "" : undefined} aria-hidden={drawerOpen || undefined}>
      <Link to="/" className="cw-brand" aria-label="Echoes of History home"><ArchiveBrand /></Link>
      <Link to="/bots" className="cw-back"><ArrowLeft size={16} />All figures</Link>
      <button ref={drawerTriggerRef} className="cw-recent" type="button" onClick={() => setDrawerOpen(true)} aria-label="My conversations" aria-haspopup="dialog" aria-expanded={drawerOpen}><History size={17} /><span>My conversations</span></button>
    </header>
    <section className="cw-identity" aria-label="Current historical figure" inert={drawerOpen ? "" : undefined} aria-hidden={drawerOpen || undefined}>
      <div className="cw-identity-inner">
        <div className="cw-avatar">{image ? <img src={image} alt={name} /> : <BookOpen size={28} />}</div>
        <div className="cw-identity-copy"><p className="cw-eyebrow">Meet a mind from another time</p><h1>{name || "Historical figure"}</h1><p>{subtitle}</p></div>
        {sections.some(item => item.id === "sources") && <button className="cw-source-link" type="button" onClick={() => explore("sources")}><BookOpen size={15} />View sources</button>}
      </div>
      <nav className="cw-modes" aria-label="Character workspace">
        <button type="button" aria-pressed={mode === "conversation"} className={mode === "conversation" ? "is-active" : ""} onClick={() => setMode("conversation")}><MessageCircle size={17} />Conversation</button>
        {sections.length > 0 && <button type="button" aria-pressed={mode === "history"} className={mode === "history" ? "is-active" : ""} onClick={() => setMode("history")}><BookOpen size={17} />Explore history</button>}
      </nav>
    </section>

    {mode === "conversation" ? <main className="cw-conversation" aria-label={`Conversation with ${name}`} inert={drawerOpen ? "" : undefined} aria-hidden={drawerOpen || undefined}>
      <div className="cw-scroll" ref={scrollRef} tabIndex={0} aria-label="Conversation messages">
        {loadError ? <div className="cw-state" role="alert"><h2>We couldn’t open this conversation.</h2><p>{loadError}</p><Link to="/bots">Return to the collection</Link></div> : loading ? <p className="cw-state" role="status">Opening your conversation…</p> : messages.length === 0 ? <div className="cw-welcome">
          <figure className="cw-welcome-art"><img src="/images/chat-writing-room.webp" alt="A sunlit painted writing desk overlooking a garden" /><figcaption>Illustrative artwork</figcaption></figure>
          <p className="cw-eyebrow">A little curiosity goes a long way</p>
          <h2>What have you always wondered?</h2>
          <p className="cw-welcome-copy">{welcomeMessage || biography || `Ask ${name || "this figure"} about their life, ideas, and the world they knew.`}</p>
          <div className="cw-starters" aria-label="Suggested opening questions">{questions.map(question => <button type="button" key={question} onClick={() => ask(question)}>{question}<span aria-hidden="true">↗</span></button>)}</div>
        </div> : <div className="cw-thread">
          {messages.map((message, index) => <article className="cw-exchange" key={message.id || index}>
            {message.message && <div className="cw-question"><p className="cw-message-author">You</p><MessageText text={message.message} /></div>}
            {message.reply && <div className="cw-answer"><div className="cw-answer-avatar">{image ? <img src={image} alt="" /> : <BookOpen size={17} />}</div><div><p className="cw-message-author">{name}</p><MessageText text={message.reply} /></div></div>}
            {message.pendingReply && !message.reply && <p className="cw-writing" role="status"><span />{name} is composing a reply…</p>}
            {message.replyError && !message.reply && <p className="cw-reply-error">This reply couldn’t be completed. Please send your question again.</p>}
          </article>)}
        </div>}
      </div>
      <div className="cw-composer-area">
        {messages.length > 0 && !sending && !loadError && <div className="cw-followups" aria-label="Follow-up questions">{["Tell me more", "What happened next?"].map(prompt => <button type="button" key={prompt} onClick={() => ask(prompt)}>{prompt}<span aria-hidden="true">↗</span></button>)}</div>}
        <form onSubmit={submit} className="cw-composer">
          <label className="sr-only" htmlFor="character-message">Your message to {name}</label>
          <textarea id="character-message" ref={textareaRef} value={draft} onChange={event => setDraft(event.target.value)} placeholder={`Ask ${name || "a question"}…`} rows={1} disabled={sending || loading || Boolean(loadError)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form.requestSubmit(); } }} />
          <button type="submit" disabled={!draft.trim() || sending || loading || Boolean(loadError)} aria-label="Send message">{sending ? <span className="cw-spinner" /> : <ArrowUp size={20} />}</button>
        </form>
        {sendError && <p className="cw-send-error" role="alert">{sendError}</p>}
        <p className="cw-disclosure">AI historical portrayal. Verify important facts with <button type="button" onClick={() => explore(sections.some(item => item.id === "sources") ? "sources" : "overview")} disabled={!sections.length}>historical sources</button>.</p>
      </div>
    </main> : <main className="cw-history" aria-label={`Explore ${name}'s history`} inert={drawerOpen ? "" : undefined} aria-hidden={drawerOpen || undefined}>
      <nav className="cw-chapters" aria-label="Historical topics"><p className="cw-eyebrow">Inside this life</p>{sections.map(item => <button type="button" key={item.id} aria-current={activeSection === item.id ? "page" : undefined} onClick={() => setSection(item.id)}>{sectionLabels[item.id] || item.label}<span aria-hidden="true">→</span></button>)}</nav>
      <label className="cw-mobile-chapters">Explore a chapter<select value={activeSection || ""} onChange={event => setSection(event.target.value)}>{sections.map(item => <option key={item.id} value={item.id}>{sectionLabels[item.id] || item.label}</option>)}</select></label>
      <div className="cw-history-content" tabIndex={0} aria-label="Historical chapter"><HistoricalExperience key={activeSection} sectionId={activeSection} details={details} name={name} onAsk={ask} onBack={sections.some(item => item.id === "overview") ? () => setSection("overview") : undefined} /></div>
    </main>}

    {drawerOpen && <div className="cw-drawer-backdrop" onClick={event => { if (event.target === event.currentTarget) closeDrawer(); }}><aside ref={dialogRef} className="cw-drawer" role="dialog" aria-modal="true" aria-labelledby="conversations-title"><button type="button" className="cw-drawer-close" onClick={closeDrawer} aria-label="Close conversations"><X size={20} /></button>{navigation}</aside></div>}
  </div>;
}
