/* eslint-disable react/prop-types, react-refresh/only-export-components */

const asArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []);
const hasText = (value) => typeof value === "string" ? value.trim().length > 0 : value !== undefined && value !== null;
const hasContent = (value) => {
  if (Array.isArray(value)) return value.some(hasContent);
  if (value && typeof value === "object") return Object.values(value).some(hasContent);
  return hasText(value);
};
const hasObjectValues = (value) => value && typeof value === "object" && Object.values(value).some(hasContent);
const meaningfulItems = (value, keys) => asArray(value).filter((item) => {
  if (typeof item === "string") return hasText(item);
  if (!item || typeof item !== "object") return false;
  return keys.some((key) => hasContent(item[key]));
});

export function buildCharacterSections(details = {}) {
  const biography = details.biography;
  const profile = details.profile;
  const sections = [];

  const hasProfile = [
    profile?.fullName,
    profile?.subtitle,
    profile?.birthDateDisplay,
    profile?.birthDate,
    profile?.birthPlace,
    profile?.deathDateDisplay,
    profile?.deathDate,
    profile?.deathPlace,
    profile?.ageAtDeath,
    profile?.heightCm,
    ...asArray(profile?.alternateNames),
    ...asArray(profile?.nationalities),
    ...asArray(profile?.occupations),
    ...asArray(profile?.eras),
    ...asArray(profile?.positionsHeld),
  ].some(hasText);

  if (hasText(biography?.short) || hasText(biography?.detailed) || hasText(biography?.historicalImportance) || hasProfile || hasText(details.description)) {
    sections.push({ id: "overview", label: "Biography" });
  }
  const conversation = details.conversation || {};
  if (
    hasText(conversation.personalityDescription) ||
    hasText(conversation.speakingStyle) ||
    asArray(conversation.coreTopics).some(hasText) ||
    asArray(conversation.suggestedQuestions).some(hasText) ||
    asArray(conversation.knowledgeLimitations).some(hasText)
  ) sections.push({ id: "conversationGuide", label: "Conversation guide" });
  if (
    meaningfulItems(details.timeline, ["title", "description", "summary", "dateDisplay", "startDate", "date"]).length ||
    meaningfulItems(details.keyMoments, ["title", "description", "summary", "dateDisplay", "date"]).length
  ) sections.push({ id: "timeline", label: "Timeline" });
  if (hasObjectValues(details.historicalContext)) sections.push({ id: "context", label: "Historical context" });
  if (meaningfulItems(details.ideasAndBeliefs, ["topic", "summary", "developmentOverTime"]).length) sections.push({ id: "ideas", label: "Ideas & beliefs" });
  if (meaningfulItems(details.documents, ["title", "summary", "significance", "externalUrl"]).length) sections.push({ id: "documents", label: "Documents" });
  if (meaningfulItems(details.relationships, ["personName", "description", "relationshipType"]).length) sections.push({ id: "relationships", label: "People" });
  if (meaningfulItems(details.controversies, ["title", "summary", "historicalContext", "majorInterpretations"]).length) sections.push({ id: "controversies", label: "Debates" });
  if (hasObjectValues(details.legacy)) sections.push({ id: "legacy", label: "Legacy" });
  if (meaningfulItems(details.sources, ["title", "organization", "type", "url"]).length) sections.push({ id: "sources", label: "Sources" });
  return sections;
}

function SectionTitle({ eyebrow, children }) {
  return <div className="mb-4"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">{eyebrow}</p><h3 className="mt-1 font-serif text-xl font-semibold text-stone-900">{children}</h3></div>;
}

function TextBlock({ title, text }) {
  if (!hasText(text)) return null;
  return <div className="border-t border-stone-100 py-4 first:border-t-0 first:pt-0"><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">{title}</p><p className="text-xs leading-5 text-stone-600">{text}</p></div>;
}

function Overview({ details, name }) {
  const biography = details.biography || {};
  const profile = details.profile || {};
  const rows = [
    ["Full name", profile.fullName],
    ["Born", profile.birthDateDisplay || profile.birthDate || details.birthDate || details.born],
    ["Birthplace", profile.birthPlace || details.birthPlace],
    ["Died", profile.deathDateDisplay || profile.deathDate || details.deathDate || details.died],
    ["Death place", profile.deathPlace],
    ["Nationality", asArray(profile.nationalities).join(", ")],
    ["Also known as", asArray(profile.alternateNames).join(", ")],
    ["Occupations", asArray(profile.occupations).join(", ") || details.occupation || details.role],
    ["Era", asArray(profile.eras).join(", ") || details.era],
    ["Age at death", profile.ageAtDeath],
    ["Height", profile.heightCm ? `${profile.heightCm} cm` : ""],
  ].filter(([, value]) => hasText(value));
  const positions = asArray(profile.positionsHeld);

  return <div className="space-y-4">
    <section className="rounded-[22px] border border-stone-200 bg-white p-5 shadow-sm">
      <SectionTitle eyebrow="Life and significance">About {name}</SectionTitle>
      {(biography.short || details.description) && <p className="text-sm leading-6 text-stone-600">{biography.short || details.description}</p>}
      {biography.historicalImportance && <p className="mt-4 border-l-2 border-stone-900 pl-3 text-xs leading-5 text-stone-600">{biography.historicalImportance}</p>}
      {rows.length > 0 && <dl className="mt-5 divide-y divide-stone-100 border-t border-stone-100">{rows.map(([label,value]) => <div key={label} className="grid grid-cols-[76px_1fr] gap-3 py-3 text-xs leading-5"><dt className="font-semibold text-stone-400">{label}</dt><dd className="text-stone-700">{String(value)}</dd></div>)}</dl>}
    </section>
    {biography.detailed && <section className="rounded-[22px] border border-stone-200 bg-[#f2eee6] p-5"><SectionTitle eyebrow="Full record">Biography</SectionTitle><p className="text-xs leading-6 text-stone-600">{biography.detailed}</p></section>}
    {positions.length > 0 && <section className="rounded-[22px] border border-stone-200 bg-white p-5"><SectionTitle eyebrow="Public life">Positions held</SectionTitle><ul className="space-y-2">{positions.map((position) => <li key={position} className="flex gap-2 text-xs leading-5 text-stone-600"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-stone-900"/>{position}</li>)}</ul></section>}
  </div>;
}

function Timeline({ details }) {
  const timelineEntries = meaningfulItems(details.timeline, ["title", "description", "summary", "dateDisplay", "startDate", "date"]);
  const entries = timelineEntries.length ? timelineEntries : meaningfulItems(details.keyMoments, ["title", "description", "summary", "dateDisplay", "date"]);
  return <section className="rounded-[22px] border border-stone-200 bg-white p-5 shadow-sm"><SectionTitle eyebrow={`${entries.length} recorded moments`}>Timeline</SectionTitle><div className="relative space-y-5 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-stone-200">{entries.map((entry,index) => <article key={entry.id || `${entry.title}-${index}`} className="relative pl-6"><span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-stone-900 ring-4 ring-white"/><p className="text-[10px] font-bold uppercase tracking-[0.13em] text-stone-400">{entry.dateDisplay || entry.startDate || entry.date || "Date uncertain"}</p><h4 className="mt-1 font-serif text-base font-semibold text-stone-800">{entry.title}</h4>{(entry.description || entry.summary) && <p className="mt-1 text-xs leading-5 text-stone-600">{entry.description || entry.summary}</p>}{entry.significance && <p className="mt-2 text-[11px] italic leading-5 text-stone-500">Why it matters: {entry.significance}</p>}</article>)}</div></section>;
}

function CardList({ items, title, eyebrow, renderMeta, renderBody }) {
  return <section className="rounded-[22px] border border-stone-200 bg-white p-5 shadow-sm"><SectionTitle eyebrow={eyebrow}>{title}</SectionTitle><div className="space-y-3">{items.map((item,index) => { const itemTitle = item.title || item.topic || item.personName; return <article key={item.id || itemTitle || index} className="rounded-2xl border border-stone-100 bg-[#faf8f4] p-4">{renderMeta?.(item)}{itemTitle && <h4 className="font-serif text-base font-semibold text-stone-800">{itemTitle}</h4>}{renderBody(item)}</article>; })}</div></section>;
}

function CharacterInfoContent({ activeTab, details, name }) {
  if (activeTab === "overview") return <Overview details={details} name={name} />;
  if (activeTab === "timeline") return <Timeline details={details} />;
  if (activeTab === "conversationGuide") {
    const conversation = details.conversation || {};
    return <div className="space-y-4">
      {(conversation.personalityDescription || conversation.speakingStyle) && <section className="rounded-[22px] border border-stone-200 bg-white p-5"><SectionTitle eyebrow="How this portrayal is framed">Conversation guide</SectionTitle><TextBlock title="Character perspective" text={conversation.personalityDescription}/><TextBlock title="Speaking style" text={conversation.speakingStyle}/></section>}
      {asArray(conversation.coreTopics).length > 0 && <section className="rounded-[22px] border border-stone-200 bg-[#f2eee6] p-5"><SectionTitle eyebrow="Good places to begin">Core topics</SectionTitle><div className="flex flex-wrap gap-2">{asArray(conversation.coreTopics).map((topic)=><span key={topic} className="rounded-full border border-stone-300 bg-white/70 px-3 py-1.5 text-[11px] text-stone-600">{topic}</span>)}</div></section>}
      {asArray(conversation.suggestedQuestions).length > 0 && <section className="rounded-[22px] border border-stone-200 bg-white p-5"><SectionTitle eyebrow="Questions from the archive">Suggested questions</SectionTitle><ul className="space-y-2">{asArray(conversation.suggestedQuestions).map((question)=><li key={question} className="rounded-xl bg-[#f8f5ef] px-3 py-2.5 text-xs leading-5 text-stone-600">{question}</li>)}</ul></section>}
      {asArray(conversation.knowledgeLimitations).length > 0 && <section className="rounded-[22px] border border-stone-200 bg-white p-5"><SectionTitle eyebrow={conversation.knowledgeCutoffDate ? `Knowledge reviewed through ${conversation.knowledgeCutoffDate}` : "Interpretive limits"}>What to keep in mind</SectionTitle><ul className="space-y-2">{asArray(conversation.knowledgeLimitations).map((limitation)=><li key={limitation} className="flex gap-2 text-xs leading-5 text-stone-600"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-stone-900"/>{limitation}</li>)}</ul></section>}
    </div>;
  }
  if (activeTab === "context") return <section className="rounded-[22px] border border-stone-200 bg-white p-5"><SectionTitle eyebrow="The world around them">Historical context</SectionTitle><TextBlock title="Before their rise" text={details.historicalContext?.worldBeforeTheirRise}/><TextBlock title="During their lifetime" text={details.historicalContext?.worldDuringTheirLife}/><TextBlock title="Major challenges" text={details.historicalContext?.majorChallenges}/></section>;
  if (activeTab === "ideas") return <CardList items={meaningfulItems(details.ideasAndBeliefs, ["topic", "summary", "developmentOverTime"])} title="Ideas & beliefs" eyebrow="Positions and development" renderMeta={(item)=>item.confidence ? <p className="mb-1 text-[9px] font-bold uppercase tracking-[.15em] text-stone-400">{item.confidence}</p> : null} renderBody={(item)=><>{item.summary && <p className="mt-1 text-xs leading-5 text-stone-600">{item.summary}</p>}{item.developmentOverTime && <p className="mt-2 border-t border-stone-200 pt-2 text-[11px] leading-5 text-stone-500">Development: {item.developmentOverTime}</p>}</>} />;
  if (activeTab === "documents") return <CardList items={meaningfulItems(details.documents, ["title", "summary", "significance", "externalUrl"])} title="Documents" eyebrow="Speeches, texts, and records" renderMeta={(item)=>{const meta=[item.documentType,item.dateDisplay].filter(Boolean).join(" · ");return meta ? <p className="mb-1 text-[9px] font-bold uppercase tracking-[.15em] text-stone-400">{meta}</p> : null;}} renderBody={(item)=><>{item.summary && <p className="mt-1 text-xs leading-5 text-stone-600">{item.summary}</p>}{item.significance && <p className="mt-2 text-[11px] italic leading-5 text-stone-500">{item.significance}</p>}{item.externalUrl && <a href={item.externalUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block border-b border-stone-500 text-[10px] font-bold uppercase tracking-[.12em] text-stone-700">View document</a>}</>} />;
  if (activeTab === "relationships") return <CardList items={meaningfulItems(details.relationships, ["personName", "description", "relationshipType"])} title="People" eyebrow="Relationships and contemporaries" renderMeta={(item)=>item.relationshipType ? <p className="mb-1 text-[9px] font-bold uppercase tracking-[.15em] text-stone-400">{item.relationshipType}</p> : null} renderBody={(item)=>item.description ? <p className="mt-1 text-xs leading-5 text-stone-600">{item.description}</p> : null} />;
  if (activeTab === "controversies") return <CardList items={meaningfulItems(details.controversies, ["title", "summary", "historicalContext", "majorInterpretations"])} title="Debates & controversies" eyebrow="Interpretations may differ" renderMeta={(item)=>item.confidence ? <p className="mb-1 text-[9px] font-bold uppercase tracking-[.15em] text-stone-400">{item.confidence}</p> : null} renderBody={(item)=><>{item.summary && <p className="mt-1 text-xs leading-5 text-stone-600">{item.summary}</p>}{item.historicalContext && <p className="mt-2 text-[11px] leading-5 text-stone-500">{item.historicalContext}</p>}{asArray(item.majorInterpretations).some(hasText) && <ul className="mt-3 space-y-2 border-t border-stone-200 pt-3">{asArray(item.majorInterpretations).filter(hasText).map((view)=><li key={view} className="text-[11px] leading-5 text-stone-600">• {view}</li>)}</ul>}</>} />;
  if (activeTab === "legacy") return <section className="rounded-[22px] border border-stone-200 bg-white p-5"><SectionTitle eyebrow="Influence and interpretation">Legacy</SectionTitle><TextBlock title="Immediate impact" text={details.legacy?.immediateImpact}/><TextBlock title="Long-term impact" text={details.legacy?.longTermImpact}/><TextBlock title="Modern reputation" text={details.legacy?.modernReputation}/>{asArray(details.legacy?.historicalDebates).length>0 && <div className="border-t border-stone-100 pt-4"><p className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-stone-400">Historical debates</p><ul className="space-y-2">{asArray(details.legacy.historicalDebates).map((debate)=><li key={typeof debate === "string" ? debate : debate.title} className="text-xs leading-5 text-stone-600">• {typeof debate === "string" ? debate : debate.summary || debate.title}</li>)}</ul></div>}</section>;
  if (activeTab === "sources") return <CardList items={meaningfulItems(details.sources, ["title", "organization", "type", "url"])} title="Sources" eyebrow="References for this profile" renderMeta={(item)=>{const meta=[item.type,item.organization].filter(Boolean).join(" · ");return meta ? <p className="mb-1 text-[9px] font-bold uppercase tracking-[.15em] text-stone-400">{meta}</p> : null;}} renderBody={(item)=>item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="mt-2 inline-block break-all text-xs leading-5 text-stone-600 underline decoration-stone-300 underline-offset-4">Open source</a> : null} />;
  return null;
}

export default function CharacterInfoPanel({ details, name, sections, activeTab, onTabChange }) {
  if (!sections.length) return null;
  return <div className="space-y-4">
    <div className="custom-scrollbar flex gap-1 overflow-x-auto rounded-2xl border border-stone-200 bg-white p-1.5 shadow-sm">
      {sections.map((section)=><button type="button" key={section.id} onClick={()=>onTabChange(section.id)} className={`flex-none rounded-xl px-3 py-2 text-[10px] font-bold transition ${activeTab===section.id?"bg-stone-900 text-white":"text-stone-500 hover:bg-stone-100 hover:text-stone-800"}`}>{section.label}</button>)}
    </div>
    <CharacterInfoContent activeTab={activeTab} details={details} name={name}/>
  </div>;
}
