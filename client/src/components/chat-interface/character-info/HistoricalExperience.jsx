/* eslint-disable react/prop-types */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, GitBranch, Lightbulb, MapPin, MessageCircle, Search, X } from "lucide-react";
import { buildCharacterSections } from "./CharacterInfoPanel";
import { chapterInfo, clean, eventDate, excerpt, historicalDate, list, orderedEvents, sourceHref } from "./historyData";
import "./history.css";

function ChapterHeader({ section, title, description }) {
  const image = ["documents", "sources", "controversies"].includes(section) ? "page-feedback-letters" : ["ideas", "conversationGuide"].includes(section) ? "page-features-cabinet" : section === "relationships" ? "page-about-gallery" : "page-workspace-path";
  return <header className={`hx-header hx-header-${section}`}><div><p className="hx-eyebrow">{chapterInfo[section][0]}</p><h2 tabIndex={-1}>{title}</h2><p className="hx-description">{description}</p></div><figure><img src={`/images/${image}.webp`} alt=""/><figcaption>Illustrative artwork</figcaption></figure></header>;
}

function ReadingText({ value, limit = 290 }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const text = clean(value);
  if (!text) return null;
  return <div className="hx-reading"><div id={id}>{(expanded ? text : excerpt(text, limit)).split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>{text.length > limit && <button type="button" className="hx-text-button" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(value => !value)}>{expanded ? "Show less" : "Read the full text"}<ChevronDown size={14} className={expanded ? "is-open" : ""}/></button>}</div>;
}

function Detail({ title, children }) {
  return <details className="hx-disclosure"><summary>{title}<ChevronDown size={16}/></summary><div>{children}</div></details>;
}

function AskAction({ onClick, children = "Ask about this" }) {
  return <button type="button" className="hx-ask" onClick={onClick}><MessageCircle size={16}/>{children}<ArrowUpRight size={15}/></button>;
}

function Callout({ title = "Why it matters", value }) {
  return clean(value) ? <aside className="hx-callout"><p className="hx-eyebrow">{title}</p><ReadingText value={value}/></aside> : null;
}

function ItemPicker({ items, selected, onChange, label, title = item => clean(item.title) }) {
  if (items.length < 2) return null;
  return <div className="hx-picker"><p className="hx-picker-label">{items.length} {label.toLowerCase()} <span>· Choose one to explore</span></p>{items.length > 8 ? <label className="hx-select-label">{label}<select value={selected} onChange={event => onChange(Number(event.target.value))}>{items.map((item, index) => <option key={index} value={index}>{title(item)}</option>)}</select></label> : <div className="hx-options" role="group" aria-label={label}>{items.map((item, index) => <button type="button" key={index} aria-pressed={selected === index} onClick={() => onChange(index)}><span>{String(index + 1).padStart(2, "0")}</span>{title(item)}{selected === index && <Check size={14}/>}</button>)}</div>}</div>;
}

function TimelineExperience({ details, onAsk }) {
  const events = useMemo(() => orderedEvents(details), [details]);
  const [selected, setSelected] = useState(() => events[0]?.recordIndex ?? 0);
  const [query, setQuery] = useState("");
  const railRef = useRef(null);
  const pointRefs = useRef([]);
  const id = useId();
  const filtered = events.filter(event => [eventDate(event), event.title, event.location, event.category, event.description, event.summary].map(clean).join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  const index = Math.max(0, filtered.findIndex(event => event.recordIndex === selected));
  const event = filtered[index];
  const dated = events.filter(item => historicalDate(item.startDate || item.date || item.dateDisplay));
  const select = (next, focus = false) => {
    if (!filtered[next]) return;
    setSelected(filtered[next].recordIndex);
    if (focus) pointRefs.current[next]?.focus({ preventScroll: true });
  };
  useEffect(() => {
    const rail = railRef.current;
    const point = pointRefs.current[index];
    if (!rail || !point) return;
    const left = point.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft - (rail.clientWidth - point.clientWidth) / 2;
    rail.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [index, query]);
  return <>
    <ChapterHeader section="timeline" title="A life, moment by moment." description="Follow the line. Choose a date to discover what happened and why it mattered."/>
    <section className="hx-timeline" aria-label="Interactive life timeline">
      <div className="hx-timeline-heading"><div><p className="hx-eyebrow">{events.length} recorded moments</p><p className="hx-timeline-range">{dated.length ? eventDate(dated[0]) : "Dates not recorded"}{dated.length > 1 && <><span aria-hidden="true">—</span>{eventDate(dated.at(-1))}</>}</p></div>{events.length > 5 && <label className="hx-search"><Search size={16}/><span className="sr-only">Find a timeline event</span><input type="search" aria-label="Find a timeline event" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a moment…"/>{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear timeline search"><X size={15}/></button>}</label>}</div>
      {event ? <>
        <p className="hx-timeline-hint" id={`${id}-help`}>Scroll along the line or use the arrow keys. Events are spaced for readability, not to scale.</p>
        <div className="hx-timeline-scroll" ref={railRef}>
          <div className="hx-timeline-track" role="tablist" aria-label="Timeline events" aria-describedby={`${id}-help`}>
            {filtered.map((item, position) => <button type="button" role="tab" id={`${id}-event-${position}`} aria-controls={`${id}-detail`} aria-selected={index === position} tabIndex={index === position ? 0 : -1} key={item.recordIndex} ref={element => { pointRefs.current[position] = element; }} className={`hx-timepoint${index === position ? " is-selected" : ""}`} onClick={() => select(position)} onKeyDown={keyEvent => {
              const next = keyEvent.key === "ArrowRight" ? Math.min(filtered.length - 1, position + 1) : keyEvent.key === "ArrowLeft" ? Math.max(0, position - 1) : keyEvent.key === "Home" ? 0 : keyEvent.key === "End" ? filtered.length - 1 : null;
              if (next !== null) { keyEvent.preventDefault(); select(next, true); }
            }}><span className="hx-point-date">{eventDate(item)}</span><span className="hx-point-line" aria-hidden="true"><span/></span><span className="hx-point-title">{clean(item.title) || "Recorded moment"}</span>{item.category && <span className="hx-point-category">{clean(item.category)}</span>}</button>)}
          </div>
        </div>
        <div className="hx-timeline-controls"><button type="button" disabled={index === 0} onClick={() => select(index - 1)} aria-label="Previous moment"><ArrowLeft size={17}/><span>Earlier</span></button><div className="hx-scrubber"><label htmlFor={`${id}-scrub`}>Moment {index + 1} of {filtered.length}</label><input id={`${id}-scrub`} type="range" min="0" max={Math.max(0, filtered.length - 1)} step="1" value={index} disabled={filtered.length < 2} aria-label="Move through the timeline" aria-valuetext={`${eventDate(event)}: ${clean(event.title)}`} onChange={rangeEvent => select(Number(rangeEvent.target.value))}/></div><button type="button" disabled={index === filtered.length - 1} onClick={() => select(index + 1)} aria-label="Next moment"><span>Later</span><ArrowRight size={17}/></button></div>
      </> : <div className="hx-empty" role="status"><p>{events.length ? `No moments match “${query}”.` : "No timeline events are recorded yet."}</p>{events.length > 0 && <button type="button" className="hx-text-button" onClick={() => setQuery("")}>Show every moment<ArrowRight size={16}/></button>}</div>}
    </section>
    {event && <article className="hx-event-detail" id={`${id}-detail`} role="tabpanel" aria-labelledby={`${id}-event-${index}`} tabIndex={0}><div className="hx-event-date"><p className="hx-eyebrow">In this moment</p><p>{eventDate(event)}</p>{event.location && <span><MapPin size={14}/>{clean(event.location)}</span>}</div><div className="hx-event-story" key={event.recordIndex}><h3>{clean(event.title) || "Recorded moment"}</h3><ReadingText value={event.description || event.summary}/><Callout value={event.significance}/><AskAction onClick={() => onAsk(`Take me back to ${clean(event.title) || eventDate(event)}. What happened, and why did this moment matter?`)}>Ask about this moment</AskAction></div></article>}
  </>;
}

function ProfileExperience({ details, name, onAsk, onExplore, sections }) {
  const profile = details.profile || {};
  const biography = details.biography || {};
  const facts = [["Full name", profile.fullName || name], ["Also known as", list(profile.alternateNames).map(clean).join(", ")], ["Born", profile.birthDateDisplay || profile.birthDate || details.birthDate || details.born], ["Birthplace", profile.birthPlace || details.birthPlace], ["Died", profile.deathDateDisplay || profile.deathDate || details.deathDate || details.died], ["Death place", profile.deathPlace], ["Nationality", list(profile.nationalities).map(clean).join(", ") || details.nationality], ["Era", list(profile.eras).map(clean).join(", ") || details.era], ["Known for", list(profile.occupations).map(clean).join(", ") || details.occupation || details.role], ["Age at death", profile.ageAtDeath], ["Height", profile.heightCm ? `${profile.heightCm} cm` : ""]].filter(([, value]) => clean(value));
  const essentials = facts.filter(([label]) => ["Born", "Died", "Known for"].includes(label));
  return <><ChapterHeader section="overview" title={`Meet ${name}.`} description={clean(profile.subtitle) || "Start with the person. Then follow what interests you."}/>
    {essentials.length > 0 && <dl className="hx-fact-strip">{essentials.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{clean(value)}</dd></div>)}</dl>}
    <article className="hx-profile-story"><div><p className="hx-eyebrow">The life behind the name</p><ReadingText value={biography.short || details.description || details.bio || details.about || (typeof biography === "string" ? biography : "")}/><Callout value={biography.historicalImportance}/><AskAction onClick={() => onAsk(`What is the most important thing to understand about your life, beyond what you are best known for?`)}>Ask about their life</AskAction></div><div className="hx-profile-record"><p className="hx-eyebrow">Look a little closer</p>{biography.detailed && <Detail title="Read the full biography"><ReadingText value={biography.detailed} limit={700}/></Detail>}<Detail title="Life & personal details"><dl className="hx-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{clean(value)}</dd></div>)}</dl></Detail>{list(profile.positionsHeld).length > 0 && <Detail title="Positions held"><ul className="hx-bullet-list">{list(profile.positionsHeld).map((position, index) => <li key={index}>{clean(position)}</li>)}</ul></Detail>}</div></article>
    {onExplore && <section className="hx-paths"><div className="hx-section-heading"><h3>Choose a way in.</h3><p>Follow your curiosity, one chapter at a time.</p></div><div className="hx-path-grid">{sections.filter(section => section.id !== "overview").map((section, index) => <button type="button" key={section.id} onClick={() => onExplore(section.id)}><span className="hx-path-number">{String(index + 1).padStart(2, "0")}</span><span><strong>{chapterInfo[section.id][0]}</strong><small>{chapterInfo[section.id][1]}</small></span><ArrowUpRight size={17}/></button>)}</div></section>}
  </>;
}

function IdeaExperience({ details, name, onAsk }) {
  const ideas = list(details.ideasAndBeliefs);
  const [selected, setSelected] = useState(0);
  const idea = ideas[selected];
  if (!idea) return null;
  return <><ChapterHeader section="ideas" title="The ideas behind the choices." description={`Explore what guided ${name}, one idea at a time.`}/><ItemPicker items={ideas} selected={selected} onChange={setSelected} label="Ideas" title={item => clean(item.topic) || "Untitled idea"}/><article key={selected} className="hx-reading-card"><div className="hx-card-title"><Lightbulb size={22}/><div><p className="hx-eyebrow">The central idea</p><h3>{clean(idea.topic)}</h3></div></div><ReadingText value={idea.summary}/>{idea.developmentOverTime && <Detail title="How this idea developed"><ReadingText value={idea.developmentOverTime}/></Detail>}{idea.confidence && <p className="hx-record-note">Record confidence: {clean(idea.confidence)}</p>}<AskAction onClick={() => onAsk(`How did your views on ${clean(idea.topic)} shape your actions, and did they ever change?`)}>Explore this idea in conversation</AskAction></article></>;
}

function ArtifactExperience({ details, onAsk }) {
  const documents = list(details.documents);
  const [selected, setSelected] = useState(0);
  const artifact = documents[selected];
  if (!artifact) return null;
  return <><ChapterHeader section="documents" title="History, in its own words." description="Choose a record. Understand its purpose, then look at the original where available."/><ItemPicker items={documents} selected={selected} onChange={setSelected} label="Documents"/><article key={selected} className="hx-reading-card hx-document"><p className="hx-eyebrow">{[clean(artifact.documentType) || "Historical record", clean(artifact.dateDisplay)].filter(Boolean).join(" · ")}</p><h3>{clean(artifact.title)}</h3><ReadingText value={artifact.summary}/><Callout value={artifact.significance}/><div className="hx-actions"><AskAction onClick={() => onAsk(`Why was ${clean(artifact.title)} created, whose perspective does it represent, and what might it leave out?`)}>Discuss this record</AskAction>{sourceHref(artifact.externalUrl) && <a className="hx-text-button" href={sourceHref(artifact.externalUrl)} target="_blank" rel="noreferrer">Read the original<ArrowUpRight size={16}/></a>}</div></article></>;
}

function RelationshipExperience({ details, name, onAsk }) {
  const people = list(details.relationships);
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState("All");
  const types = [...new Set(people.map(person => clean(person.relationshipType) || "Other"))];
  const visible = people.map((person, index) => ({ ...person, index })).filter(person => filter === "All" || (clean(person.relationshipType) || "Other") === filter);
  const person = visible.find(item => item.index === selected) || visible[0];
  return <><ChapterHeader section="relationships" title="No life happens alone." description={`Meet the people connected to ${name}. Select a person to understand their role.`}/>{types.length > 1 && <div className="hx-filters" role="group" aria-label="Relationship types">{["All", ...types].map(type => <button type="button" key={type} aria-pressed={filter === type} onClick={() => setFilter(type)}>{type}</button>)}</div>}<div className="hx-people-layout"><div className="hx-people" role="group" aria-label="People in this life">{visible.map(item => <button type="button" key={item.index} aria-pressed={person?.index === item.index} onClick={() => setSelected(item.index)}><span className="hx-person-initial">{clean(item.personName).charAt(0)}</span><span><strong>{clean(item.personName)}</strong><small>{clean(item.relationshipType) || "Connection"}</small></span><ArrowRight size={15}/></button>)}</div>{person && <article className="hx-reading-card" key={person.index}><p className="hx-eyebrow">{clean(person.relationshipType) || "Connection"}</p><h3>{clean(person.personName)}</h3><ReadingText value={person.description}/><AskAction onClick={() => onAsk(`How did ${clean(person.personName)} shape your choices, and how might they describe you differently?`)}>Ask about this connection</AskAction></article>}</div></>;
}

function InvestigationExperience({ details, name, onAsk }) {
  const cases = list(details.controversies);
  const [selected, setSelected] = useState(0);
  const [position, setPosition] = useState(null);
  const current = cases[selected];
  if (!current) return null;
  const interpretations = list(current.majorInterpretations);
  return <><ChapterHeader section="controversies" title="More than one perspective." description="Understand the debate, compare interpretations, and ask what evidence supports each one."/><ItemPicker items={cases} selected={selected} onChange={index => { setSelected(index); setPosition(null); }} label="Debates"/><article key={selected} className="hx-reading-card"><p className="hx-eyebrow">The question historians debate</p><h3>{clean(current.title)}</h3><ReadingText value={current.summary}/>{current.historicalContext && <Detail title="The context behind this debate"><ReadingText value={current.historicalContext}/></Detail>}{current.confidence && <p className="hx-record-note">Record confidence: {clean(current.confidence)}</p>}{interpretations.length > 0 && <section className="hx-interpretations"><div className="hx-section-heading"><h4>Compare the interpretations</h4><p>Select a perspective to discuss its evidence and assumptions.</p></div><div className="hx-comparison-grid">{interpretations.map((view, index) => <button type="button" key={index} aria-pressed={position === index} onClick={() => setPosition(position === index ? null : index)}><span className="hx-eyebrow">Perspective {index + 1}{position === index && <Check size={16}/>}</span><span>{clean(view)}</span><small>{position === index ? "Selected for discussion" : "Examine this perspective"}<ArrowUpRight size={14}/></small></button>)}</div></section>}<div className="hx-discussion-prompt"><p>{position === null ? "What evidence would help you understand this debate?" : `Ask ${name} to respond, then consider what their account might leave out.`}</p><AskAction onClick={() => onAsk(position === null ? `Help me understand the debate about ${clean(current.title)}. What evidence supports the different interpretations?` : `One interpretation is: “${clean(interpretations[position])}” How would you respond, and what evidence might challenge your account?`)}>{position === null ? "Discuss the debate" : "Question this interpretation"}</AskAction></div></article></>;
}

function SceneExperience({ details, name, onAsk, type }) {
  const isLegacy = type === "legacy";
  const source = (isLegacy ? details.legacy : details.historicalContext) || {};
  const scenes = (isLegacy ? [["Immediate impact", source.immediateImpact], ["Long-term impact", source.longTermImpact], ["Modern reputation", source.modernReputation], ...list(source.historicalDebates).map((text, index) => [`Debate ${index + 1}`, text])] : [["Before their rise", source.worldBeforeTheirRise], ["During their life", source.worldDuringTheirLife], ["Major challenges", source.majorChallenges]]).filter(([, value]) => clean(value));
  const [selected, setSelected] = useState(0);
  const [compare, setCompare] = useState(false);
  if (!scenes.length) return null;
  return <><ChapterHeader section={type} title={isLegacy ? "What changed. What stayed." : "Step into their world."} description={isLegacy ? `Follow the impact of ${name}, from immediate consequences to later interpretations.` : "See the wider picture: the world before, the world they knew, and its challenges."}/><div className="hx-view-toolbar"><p>{compare ? "Read the accounts side by side." : "Explore one part of the story at a time."}</p>{scenes.length > 1 && <button type="button" className="hx-toggle" aria-pressed={compare} onClick={() => setCompare(value => !value)}><GitBranch size={16}/>{compare ? "Read one at a time" : "Compare side by side"}</button>}</div>{!compare && <ItemPicker items={scenes} selected={selected} onChange={setSelected} label={isLegacy ? "Perspectives" : "Scenes"} title={item => item[0]}/>}<div className={compare ? "hx-scene-comparison" : ""}>{(compare ? scenes.map((scene, index) => ({ scene, index })) : [{ scene: scenes[selected], index: selected }]).map(({ scene, index }) => <article className="hx-reading-card" key={index}><p className="hx-eyebrow">{String(index + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}</p><h3>{scene[0]}</h3><ReadingText value={scene[1]}/><AskAction onClick={() => onAsk(`Help me understand ${scene[0].toLowerCase()}. What should I notice, and what might other historians add?`)}>Ask about {isLegacy ? "this impact" : "this world"}</AskAction></article>)}</div></>;
}

function CuriosityExperience({ details, name, onAsk }) {
  const conversation = details.conversation || {};
  const questions = list(conversation.suggestedQuestions);
  const topics = list(conversation.coreTopics);
  return <><ChapterHeader section="conversationGuide" title="A good question opens a door." description={`Choose a question for ${name}. It will appear in your message box, ready to edit or send.`}/><div className="hx-question-grid">{questions.map((question, index) => <button type="button" key={index} onClick={() => onAsk(clean(question))}><span className="hx-eyebrow">Question {String(index + 1).padStart(2, "0")}</span><strong>{clean(question)}</strong><span className="hx-question-action">Use this question<ArrowUpRight size={17}/></span></button>)}</div>{topics.length > 0 && <section className="hx-topics"><h3>Or follow a topic.</h3><div className="hx-filters">{topics.map((topic, index) => <button type="button" key={index} onClick={() => onAsk(`I want to explore ${clean(topic)}. Where should we begin?`)}>{clean(topic)}<ArrowUpRight size={14}/></button>)}</div></section>}{(conversation.personalityDescription || conversation.speakingStyle || list(conversation.knowledgeLimitations).length > 0 || conversation.knowledgeCutoffDate) && <Detail title="About this AI portrayal">{conversation.personalityDescription && <ReadingText value={conversation.personalityDescription}/>} {conversation.speakingStyle && <ReadingText value={conversation.speakingStyle}/>} {conversation.knowledgeCutoffDate && <p>Knowledge reviewed through {clean(conversation.knowledgeCutoffDate)}</p>}<ul className="hx-bullet-list">{list(conversation.knowledgeLimitations).map((item, index) => <li key={index}>{clean(item)}</li>)}</ul></Detail>}</>;
}

function EvidenceExperience({ details }) {
  const sources = list(details.sources);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const types = [...new Set(sources.map(source => clean(source.type)).filter(Boolean))];
  const visible = sources.filter(source => (filter === "All" || clean(source.type) === filter) && [source.title, source.organization, source.type].map(clean).join(" ").toLowerCase().includes(query.toLowerCase().trim()));
  return <><ChapterHeader section="sources" title="Go back to the evidence." description="Explore the references behind this profile. Compare accounts and follow the original sources."/><div className="hx-source-toolbar"><label className="hx-search"><Search size={16}/><span className="sr-only">Search sources</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search title or institution…"/></label><p role="status">{visible.length} of {sources.length} sources</p></div>{types.length > 1 && <div className="hx-filters" role="group" aria-label="Source types">{["All", ...types].map(type => <button type="button" key={type} aria-pressed={filter === type} onClick={() => setFilter(type)}>{type}</button>)}</div>}<div className="hx-source-grid">{visible.map((source, index) => <article key={source.id || `${source.title}-${index}`}><BookOpen size={20}/><p className="hx-eyebrow">{clean(source.type) || "Reference"}</p><h3>{clean(source.title) || "Untitled source"}</h3>{source.organization && <p>{clean(source.organization)}</p>}{sourceHref(source.url) ? <a href={sourceHref(source.url)} target="_blank" rel="noreferrer">Open source<ArrowUpRight size={16}/></a> : <p className="hx-record-note">No online link in this record.</p>}</article>)}</div>{visible.length === 0 && <div className="hx-empty"><p>No sources match these filters.</p><button type="button" className="hx-text-button" onClick={() => { setQuery(""); setFilter("All"); }}>Clear filters<ArrowRight size={16}/></button></div>}</>;
}

export default function HistoricalExperience({ sectionId, details, name, onAsk, onExplore, onBack }) {
  const rootRef = useRef(null);
  const sections = useMemo(() => buildCharacterSections(details).sort((a, b) => Object.keys(chapterInfo).indexOf(a.id) - Object.keys(chapterInfo).indexOf(b.id)), [details]);
  useEffect(() => {
    rootRef.current?.closest(".cw-history-content, .experience-stage")?.scrollTo({ top: 0, behavior: "instant" });
    rootRef.current?.querySelector(".hx-header h2")?.focus({ preventScroll: true });
  }, [sectionId]);
  const props = { details, name, onAsk, onExplore, sections };
  const position = sections.findIndex(section => section.id === sectionId);
  const previous = sections[position - 1];
  const next = sections[position + 1];
  let content;
  if (sectionId === "timeline") content = <TimelineExperience {...props}/>;
  else if (sectionId === "controversies") content = <InvestigationExperience {...props}/>;
  else if (sectionId === "documents") content = <ArtifactExperience {...props}/>;
  else if (sectionId === "ideas") content = <IdeaExperience {...props}/>;
  else if (sectionId === "relationships") content = <RelationshipExperience {...props}/>;
  else if (sectionId === "context" || sectionId === "legacy") content = <SceneExperience {...props} type={sectionId}/>;
  else if (sectionId === "conversationGuide") content = <CuriosityExperience {...props}/>;
  else if (sectionId === "sources") content = <EvidenceExperience {...props}/>;
  else content = <ProfileExperience {...props}/>;
  return <div className="hx-experience" ref={rootRef}>{content}{onExplore && sections.length > 1 ? <nav className="hx-chapter-footer" aria-label="Continue exploring"><p>Chapter {position + 1} of {sections.length}<span>Keep exploring</span></p><div>{previous && <button type="button" onClick={() => onExplore(previous.id)}><ArrowLeft size={17}/><span><small>Previous chapter</small>{chapterInfo[previous.id][0]}</span></button>}{next && <button type="button" onClick={() => onExplore(next.id)}><span><small>Next chapter</small>{chapterInfo[next.id][0]}</span><ArrowRight size={17}/></button>}</div></nav> : onBack && <button type="button" className="hx-text-button hx-back" onClick={onBack}><ArrowLeft size={16}/>Back to life story</button>}</div>;
}
