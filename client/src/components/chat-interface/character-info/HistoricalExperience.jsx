/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";

const list = (value) => Array.isArray(value) ? value.filter(Boolean) : [];
const clean = (value = "") => typeof value === "string" ? value.replace(/\s*\[[^\]]+\]\s*$/g, "").trim() : value;

function ExperienceHeader({ eyebrow, title, description, onBack }) {
  return (
    <header className="mb-7 flex items-start gap-4 border-b border-stone-900/10 pb-6">
      <button type="button" onClick={onBack} className="grid h-10 w-10 flex-none place-items-center rounded-full border border-stone-900/10 bg-white text-stone-600 transition hover:bg-stone-900 hover:text-white" aria-label="Return to historical workspace">←</button>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#a34c35]">{eyebrow}</p>
        <h2 className="mt-1 font-serif text-3xl leading-tight text-stone-900 sm:text-4xl">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">{description}</p>}
      </div>
    </header>
  );
}

function AskAction({ children, onClick }) {
  return <button type="button" onClick={onClick} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#a34c35] px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-stone-900">Write about this <span>→</span><span className="sr-only">{children}</span></button>;
}

function timelineOrder(event, index) {
  const value = String(event.startDate || event.date || event.dateDisplay || "");
  const match = value.match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);
  if (!match) return Number.MAX_SAFE_INTEGER - 1000 + index;
  const isBce = /\b(?:BC|BCE)\b/i.test(value);
  const year = Math.abs(Number(match[1])) * (isBce ? -1 : 1);
  const month = Number(match[2] || 0);
  const day = Number(match[3] || 0);
  return year * 10000 + month * 100 + day;
}

function TimelineExperience({ details, name, onAsk, onBack }) {
  const sourceEvents = list(details.timeline).length ? list(details.timeline) : list(details.keyMoments);
  const events = [...sourceEvents].sort((first, second) => timelineOrder(first, 0) - timelineOrder(second, 0));
  const [selected, setSelected] = useState(0);
  const eventRefs = useRef([]);
  const event = events[selected];

  useEffect(() => {
    eventRefs.current[selected]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected]);

  if (!event) return null;
  return <div>
    <ExperienceHeader eyebrow={`${events.length} moments in chronological order`} title="Walk through the timeline" description={`Follow ${name}'s life from beginning to end. Select any point to enter that moment.`} onBack={onBack}/>
    <div className="grid items-start gap-6 md:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)] lg:grid-cols-[minmax(310px,0.82fr)_minmax(0,1.18fr)]">
      <nav className="custom-scrollbar relative max-h-[420px] overflow-y-auto rounded-[30px] border border-stone-900/10 bg-[#f8f3ea] px-4 py-6 shadow-[0_12px_32px_rgba(75,57,39,0.06)] md:max-h-[min(70vh,740px)]" aria-label={`${name} timeline`}>
        <div className="absolute bottom-9 left-[38px] top-9 w-px bg-stone-300" aria-hidden="true" />
        <ol className="relative space-y-1.5">
          {events.map((item,index) => {
            const active = selected === index;
            return <li key={item.id || `${item.title}-${index}`}>
              <button
                type="button"
                ref={(element) => { eventRefs.current[index] = element; }}
                onClick={() => setSelected(index)}
                aria-current={active ? "step" : undefined}
                className={`group relative flex w-full items-start gap-4 rounded-[22px] px-3.5 py-4 text-left transition ${active ? "bg-white shadow-[0_8px_24px_rgba(75,57,39,0.09)]" : "hover:bg-white/60"}`}
              >
                <span className={`relative z-10 mt-1 h-4 w-4 flex-none rounded-full border-2 ring-4 ring-[#f8f3ea] transition ${active ? "scale-110 border-[#a34c35] bg-[#a34c35]" : "border-stone-400 bg-[#f8f3ea] group-hover:border-[#a34c35]"}`} />
                <span className="min-w-0">
                  <span className={`block text-[10px] font-bold uppercase tracking-[0.16em] ${active ? "text-[#a34c35]" : "text-stone-400"}`}>{clean(item.dateDisplay || item.startDate || item.date || "Date unknown")}</span>
                  <span className={`mt-1.5 block font-serif text-lg leading-6 ${active ? "text-stone-900" : "text-stone-600"}`}>{clean(item.title)}</span>
                  {(item.location || item.category) && <span className="mt-1.5 block text-[10px] uppercase leading-4 tracking-wider text-stone-400">{clean(item.location || item.category)}</span>}
                </span>
              </button>
            </li>;
          })}
        </ol>
      </nav>

      <div className="md:sticky md:top-0">
        <article className="relative min-h-[430px] overflow-hidden rounded-[32px] border border-stone-900/10 bg-[#f3eadc] p-7 shadow-[0_16px_40px_rgba(75,57,39,0.08)] sm:min-h-[470px] sm:p-9">
          <span className="absolute -right-3 -top-8 font-serif text-[120px] leading-none text-stone-900/[0.04]">{String(selected+1).padStart(2,"0")}</span>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#a34c35] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white">Moment {selected+1} of {events.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a34c35]">{clean(event.dateDisplay || event.startDate || event.date || "Date uncertain")}</span>
          </div>
          <h3 className="mt-5 max-w-xl font-serif text-4xl leading-tight text-stone-900">{clean(event.title)}</h3>
          {(event.location || event.category) && <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">{[clean(event.location), clean(event.category)].filter(Boolean).join(" · ")}</p>}
          <p className="mt-7 max-w-2xl text-base leading-8 text-stone-600">{clean(event.description || event.summary)}</p>
          {event.significance && <div className="mt-6 rounded-[22px] bg-white/70 p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Why this changed history</p><p className="mt-2 text-xs leading-6 text-stone-600">{clean(event.significance)}</p></div>}
          <AskAction onClick={()=>onAsk(`Take me back to ${clean(event.title)}. What did you see, fear, and decide in that moment?`)}>this moment</AskAction>
        </article>
        <div className="mt-4 flex justify-between gap-3">
          <button type="button" disabled={selected===0} onClick={()=>setSelected(value=>value-1)} className="flex-1 rounded-full border border-stone-900/10 bg-white px-4 py-3 text-sm font-bold transition hover:border-stone-900 disabled:opacity-30">← Previous moment</button>
          <button type="button" disabled={selected===events.length-1} onClick={()=>setSelected(value=>value+1)} className="flex-1 rounded-full border border-stone-900/10 bg-white px-4 py-3 text-sm font-bold transition hover:border-stone-900 disabled:opacity-30">Next moment →</button>
        </div>
      </div>
    </div>
  </div>;
}

function InvestigationExperience({ details, name, onAsk, onBack }) {
  const cases = list(details.controversies);
  const [selected, setSelected] = useState(0);
  const [position, setPosition] = useState(null);
  const current = cases[selected];
  if (!current) return null;
  const chooseCase = (index) => { setSelected(index); setPosition(null); };
  return <div>
    <ExperienceHeader eyebrow="Historical investigation" title="Open the case files" description="History does not always leave one uncontested answer. Compare the claims, inspect the context, and decide what the evidence supports." onBack={onBack}/>
    <div className="grid gap-5 lg:grid-cols-[210px_1fr]">
      <nav className="space-y-2">{cases.map((item,index)=><button type="button" key={item.title} onClick={()=>chooseCase(index)} className={`w-full rounded-[20px] border p-4 text-left transition ${selected===index?"border-stone-900 bg-stone-900 text-white":"border-stone-900/10 bg-white hover:border-stone-400"}`}><span className="text-[9px] font-bold uppercase tracking-wider opacity-50">Case {String(index+1).padStart(2,"0")}</span><span className="mt-1 block font-serif text-base leading-5">{clean(item.title)}</span></button>)}</nav>
      <article className="rounded-[28px] border border-stone-900/10 bg-[#fbf7ef] p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3"><p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#a34c35]">Status: {current.confidence || "debated"}</p><span className="rounded-full border border-[#a34c35]/20 bg-[#a34c35]/5 px-3 py-1 text-[9px] font-bold text-[#a34c35]">You are the historian</span></div>
        <h3 className="mt-4 font-serif text-2xl">{clean(current.title)}</h3>
        <p className="mt-3 text-sm leading-6 text-stone-600">{clean(current.summary)}</p>
        {current.historicalContext && <div className="mt-5 rounded-[20px] bg-white p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Context</p><p className="mt-2 text-xs leading-6 text-stone-600">{clean(current.historicalContext)}</p></div>}
        <p className="mb-3 mt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">Which interpretation deserves closer examination?</p>
        <div className="space-y-2">{list(current.majorInterpretations).map((view,index)=><button type="button" key={view} onClick={()=>setPosition(index)} className={`w-full rounded-[18px] border p-4 text-left text-xs leading-6 transition ${position===index?"border-[#a34c35] bg-[#a34c35]/5 text-stone-900":"border-stone-900/10 bg-white text-stone-600 hover:border-stone-400"}`}><span className="mr-2 font-serif text-lg text-[#a34c35]">{String.fromCharCode(65+index)}.</span>{clean(view)}</button>)}</div>
        {position!==null && <div className="mt-5 rounded-[20px] border border-dashed border-[#a34c35]/40 bg-white/60 p-4"><p className="text-xs leading-6 text-stone-600">Good historians test a position rather than simply accepting it. Ask {name} to defend or challenge this interpretation.</p><AskAction onClick={()=>onAsk(`Historians argue that ${clean(current.majorInterpretations[position])} How would you respond, and what evidence might challenge your account?`)}>this interpretation</AskAction></div>}
      </article>
    </div>
  </div>;
}

function ArtifactExperience({ details, onAsk, onBack }) {
  const documents = list(details.documents);
  const [selected, setSelected] = useState(0);
  const artifact = documents[selected];
  if (!artifact) return null;
  return <div>
    <ExperienceHeader eyebrow="Artifact desk" title="Examine the surviving record" description="Select an object from the desk. Consider who created it, why it survived, and what it cannot tell us." onBack={onBack}/>
    <div className="grid gap-5 sm:grid-cols-[minmax(210px,0.75fr)_1.25fr]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">{documents.map((document,index)=><button type="button" key={document.id || document.title} onClick={()=>setSelected(index)} className={`relative min-h-[105px] overflow-hidden rounded-[22px] border p-4 text-left transition hover:-translate-y-0.5 ${selected===index?"border-[#a34c35] bg-[#efe2d1] shadow-md":"border-stone-900/10 bg-white"}`}><span className="text-[9px] font-bold uppercase tracking-wider text-[#a34c35]">{clean(document.documentType || "record")}</span><span className="mt-2 block font-serif text-base leading-5">{clean(document.title)}</span>{document.dateDisplay && <span className="mt-2 block text-[10px] text-stone-400">{clean(document.dateDisplay)}</span>}</button>)}</div>
      <article className="letter-paper relative min-h-[360px] overflow-hidden rounded-[30px] border border-[#d8cbb8] p-6 shadow-[0_18px_40px_rgba(75,57,39,0.1)] sm:p-8">
        <div className="absolute right-5 top-5 grid h-14 w-14 rotate-6 place-items-center rounded-full border border-[#a34c35]/35 text-center text-[7px] font-bold uppercase tracking-wider text-[#a34c35]/60">Archive<br/>copy</div>
        <p className="pr-16 text-[9px] font-bold uppercase tracking-[0.22em] text-[#a34c35]">Object {String(selected+1).padStart(2,"0")} · {clean(artifact.documentType || "historical record")}</p>
        <h3 className="mt-5 max-w-md font-serif text-3xl">{clean(artifact.title)}</h3>
        {artifact.summary && <p className="mt-6 text-sm leading-7 text-stone-600">{clean(artifact.summary)}</p>}
        {artifact.significance && <div className="mt-6 border-l-2 border-[#a34c35] pl-4"><p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Why it matters</p><p className="mt-2 text-xs leading-6 text-stone-600">{clean(artifact.significance)}</p></div>}
        {artifact.externalUrl && <a href={artifact.externalUrl} target="_blank" rel="noreferrer" className="mt-5 inline-block text-xs font-bold underline underline-offset-4">Open the original record</a>}
        <AskAction onClick={()=>onAsk(`I am examining ${clean(artifact.title)}. Why was it created, whose perspective does it represent, and what might it leave out?`)}>this artifact</AskAction>
      </article>
    </div>
  </div>;
}

function concise(value, limit = 170) {
  const text = clean(value || "");
  if (text.length <= limit) return text;
  const shortened = text.slice(0, limit);
  return `${shortened.slice(0, shortened.lastIndexOf(" "))}…`;
}

function IdeaExperience({ details, name, onAsk, onBack }) {
  const ideas = list(details.ideasAndBeliefs);
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const idea = ideas[selected];
  if (!idea) return null;
  const chooseIdea = (index) => { setSelected(index); setExpanded(false); };

  return <div>
    <ExperienceHeader eyebrow="Idea lens" title={`What guided ${name}?`} description="Choose one idea at a time. Start with the takeaway, then open the deeper context only when you want it." onBack={onBack}/>
    <div className="custom-scrollbar mb-5 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label={`${name} ideas`}>
      {ideas.map((item,index)=><button type="button" role="tab" aria-selected={selected===index} key={item.topic} onClick={()=>chooseIdea(index)} className={`min-w-[170px] rounded-[20px] border px-4 py-3 text-left transition ${selected===index?"border-stone-900 bg-stone-900 text-white shadow-md":"border-stone-900/10 bg-white text-stone-600 hover:border-stone-400"}`}><span className="text-[9px] font-bold uppercase tracking-wider opacity-50">Idea {String(index+1).padStart(2,"0")}</span><span className="mt-1 block font-serif text-base leading-5">{clean(item.topic)}</span></button>)}
    </div>
    <article className="grid overflow-hidden rounded-[30px] border border-stone-900/10 bg-[#f3eadc] sm:grid-cols-[150px_minmax(0,1fr)]">
      <div className="flex flex-col justify-between bg-[#a34c35] p-6 text-white">
        <span className="font-serif text-6xl text-white/25">{String(selected+1).padStart(2,"0")}</span>
        <div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/55">Confidence</p><p className="mt-1 text-xs font-bold capitalize">{idea.confidence || "reported"}</p></div>
      </div>
      <div className="p-6 sm:p-8">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#a34c35]">The central idea</p>
        <h3 className="mt-3 font-serif text-3xl leading-tight text-stone-900">{clean(idea.topic)}</h3>
        <p className="mt-5 text-sm leading-7 text-stone-600">{expanded ? clean(idea.summary) : concise(idea.summary)}</p>
        {expanded && idea.developmentOverTime && <div className="mt-5 rounded-[20px] bg-white/70 p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">How it developed</p><p className="mt-2 text-xs leading-6 text-stone-600">{clean(idea.developmentOverTime)}</p></div>}
        {(clean(idea.summary).length > 170 || idea.developmentOverTime) && <button type="button" onClick={()=>setExpanded(value=>!value)} className="mt-5 rounded-full border border-stone-900/10 bg-white px-4 py-2 text-xs font-bold text-stone-600 transition hover:border-stone-900">{expanded?"Show less":"Open deeper context"}</button>}
        <div><AskAction onClick={()=>onAsk(`Your views on ${clean(idea.topic)} seem important. How did this belief shape your actions, and did it ever change?`)}>this idea</AskAction></div>
      </div>
    </article>
  </div>;
}

function RelationshipExperience({ details, name, onAsk, onBack }) {
  const people = list(details.relationships);
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const person = people[selected];
  if (!person) return null;
  const groups = people.reduce((result, item, index) => {
    const label = clean(item.relationshipType || "Other connections");
    const existing = result.find((group) => group.label === label);
    if (existing) existing.items.push({ item, index });
    else result.push({ label, items: [{ item, index }] });
    return result;
  }, []);
  const choosePerson = (index) => { setSelected(index); setExpanded(false); };

  return <div>
    <ExperienceHeader eyebrow="People index" title={`Who shaped ${name}'s story?`} description="People are grouped by their role in the figure's life. Select a name for the essential connection." onBack={onBack}/>
    <div className="grid gap-5 md:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.2fr)]">
      <div className="custom-scrollbar max-h-[520px] space-y-5 overflow-y-auto rounded-[28px] border border-stone-900/10 bg-[#f8f3ea] p-4">
        {groups.map((group)=><section key={group.label}><p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">{group.label}</p><div className="space-y-1">{group.items.map(({item,index})=><button type="button" key={`${item.personName}-${index}`} onClick={()=>choosePerson(index)} className={`flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition ${selected===index?"bg-stone-900 text-white shadow-md":"bg-white/60 text-stone-700 hover:bg-white"}`}><span className={`grid h-8 w-8 flex-none place-items-center rounded-full font-serif text-sm ${selected===index?"bg-white/15":"bg-[#eee3d3] text-[#a34c35]"}`}>{clean(item.personName).charAt(0)}</span><span className="font-serif text-sm leading-5">{clean(item.personName)}</span></button>)}</div></section>)}
      </div>
      <article className="self-start rounded-[30px] border border-stone-900/10 bg-white p-6 shadow-sm md:sticky md:top-0 sm:p-8">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#a34c35]">{clean(person.relationshipType || "Connection")}</p>
        <h3 className="mt-3 font-serif text-3xl leading-tight">{clean(person.personName)}</h3>
        <p className="mt-5 text-sm leading-7 text-stone-600">{expanded ? clean(person.description) : concise(person.description)}</p>
        {clean(person.description).length > 170 && <button type="button" onClick={()=>setExpanded(value=>!value)} className="mt-5 rounded-full border border-stone-900/10 bg-[#f8f3ea] px-4 py-2 text-xs font-bold text-stone-600">{expanded?"Show less":"Read full connection"}</button>}
        <div><AskAction onClick={()=>onAsk(`Tell me about ${clean(person.personName)}. How did this person shape your choices and how might they describe you differently?`)}>this person</AskAction></div>
      </article>
    </div>
  </div>;
}

function SceneExperience({ details, name, onAsk, onBack, type }) {
  const isLegacy = type === "legacy";
  const source = isLegacy ? details.legacy || {} : details.historicalContext || {};
  const scenes = isLegacy ? [
    ["Immediate impact", source.immediateImpact], ["Long-term impact", source.longTermImpact], ["Modern reputation", source.modernReputation], ...list(source.historicalDebates).map((text,index)=>[`Debate ${index+1}`,text])
  ] : [["Before their rise",source.worldBeforeTheirRise],["During their life",source.worldDuringTheirLife],["Major challenges",source.majorChallenges]];
  const available = scenes.filter(([,text])=>text);
  const [selected,setSelected] = useState(0);
  const scene=available[selected];
  if(!scene) return null;
  return <div><ExperienceHeader eyebrow={isLegacy?"Impact explorer":"World builder"} title={isLegacy?"Follow the consequences":"Enter the historical world"} description={isLegacy?`Trace how ${name}'s actions were remembered, challenged, and reinterpreted.`:"Move between historical scenes to understand the conditions surrounding the figure."} onBack={onBack}/><div className="grid gap-5 sm:grid-cols-[190px_1fr]"><div className="space-y-2">{available.map(([title],index)=><button type="button" key={`${title}-${index}`} onClick={()=>setSelected(index)} className={`w-full rounded-[18px] border px-4 py-3 text-left text-xs font-bold transition ${selected===index?"border-stone-900 bg-stone-900 text-white":"border-stone-900/10 bg-white"}`}>{title}</button>)}</div><article className="relative min-h-[330px] overflow-hidden rounded-[30px] border border-stone-900/10 bg-[#eee3d3] p-7 sm:p-9"><p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#a34c35]">Scene {String(selected+1).padStart(2,"0")}</p><h3 className="mt-4 font-serif text-3xl">{scene[0]}</h3><p className="mt-6 text-sm leading-7 text-stone-600">{clean(scene[1])}</p><AskAction onClick={()=>onAsk(`Help me understand ${scene[0].toLowerCase()}. What would you want a student to notice, and what might your critics add?`)}>this scene</AskAction></article></div></div>;
}

function ProfileExperience({ details, name, onAsk, onBack }) {
  const profile=details.profile||{};
  const biography=details.biography||{};
  const facts=[["Born",profile.birthDateDisplay||profile.birthDate],["Birthplace",profile.birthPlace],["Died",profile.deathDateDisplay||profile.deathDate],["Era",list(profile.eras).join(", ")],["Known for",list(profile.occupations).join(", ")]].filter(([,value])=>value);
  const [revealed,setRevealed]=useState(false);
  return <div><ExperienceHeader eyebrow="Identity dossier" title={`Meet ${name}`} description="Start with the public record, then look beyond the label history gave them." onBack={onBack}/><div className="grid gap-5 sm:grid-cols-[0.8fr_1.2fr]"><section className="rounded-[28px] bg-stone-900 p-6 text-white"><p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/45">At a glance</p><h3 className="mt-4 font-serif text-3xl">{profile.fullName||name}</h3>{profile.subtitle&&<p className="mt-2 text-sm text-white/60">{clean(profile.subtitle)}</p>}<dl className="mt-6 divide-y divide-white/10">{facts.map(([label,value])=><div key={label} className="py-3"><dt className="text-[9px] font-bold uppercase tracking-wider text-white/40">{label}</dt><dd className="mt-1 text-xs leading-5 text-white/80">{clean(value)}</dd></div>)}</dl></section><section className="rounded-[28px] border border-stone-900/10 bg-[#f3eadc] p-6 sm:p-8"><p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#a34c35]">The life behind the name</p><p className="mt-4 font-serif text-xl leading-8 text-stone-700">{clean(biography.short||details.description)}</p>{!revealed&&biography.detailed?<button type="button" onClick={()=>setRevealed(true)} className="mt-6 rounded-full border border-stone-900/10 bg-white px-4 py-2 text-xs font-bold">Reveal the fuller story</button>:null}{revealed&&<div className="mt-6 animate-[fade-in_.4s_ease-out]"><p className="text-sm leading-7 text-stone-600">{clean(biography.detailed)}</p>{biography.historicalImportance&&<p className="mt-5 border-l-2 border-[#a34c35] pl-4 text-xs leading-6 text-stone-600">{clean(biography.historicalImportance)}</p>}</div>}<AskAction onClick={()=>onAsk(`When people reduce your life to "${clean(profile.subtitle||biography.short)}", what important part of your story do they miss?`)}>their life story</AskAction></section></div></div>;
}

function CuriosityExperience({ details, name, onAsk, onBack }) {
  const questions=list(details.conversation?.suggestedQuestions);
  const topics=list(details.conversation?.coreTopics);
  return <div><ExperienceHeader eyebrow="Curiosity engine" title="Choose your next question" description={`Use the archive to begin a more focused exchange with ${name}.`} onBack={onBack}/><div className="grid gap-3 sm:grid-cols-2">{questions.map((question,index)=><button type="button" key={question} onClick={()=>onAsk(clean(question))} className="group min-h-[140px] rounded-[26px] border border-stone-900/10 bg-[#fbf7ef] p-5 text-left transition hover:-translate-y-1 hover:border-[#a34c35]/40 hover:shadow-lg"><span className="text-[9px] font-bold uppercase tracking-wider text-[#a34c35]">Question {String(index+1).padStart(2,"0")}</span><span className="mt-3 block font-serif text-lg leading-6">{clean(question)}</span><span className="mt-4 inline-block text-xs transition group-hover:translate-x-1">Begin →</span></button>)}</div>{topics.length>0&&<div className="mt-7 rounded-[26px] bg-[#eee5d6] p-5"><p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-stone-500">Or follow a topic</p><div className="flex flex-wrap gap-2">{topics.map(topic=><button type="button" key={topic} onClick={()=>onAsk(`I want to explore ${clean(topic)}. Where should we begin?`)} className="rounded-full border border-stone-900/10 bg-white px-3 py-2 text-xs">{clean(topic)}</button>)}</div></div>}</div>;
}

function EvidenceExperience({ details, onBack }) {
  const sources=list(details.sources);
  return <div><ExperienceHeader eyebrow="Evidence room" title="Check the record" description="Historical interpretation is only as strong as its evidence. Open a source and consider what kind of account it provides." onBack={onBack}/><div className="grid gap-3 sm:grid-cols-2">{sources.map((source,index)=><a key={source.id||source.url} href={source.url} target="_blank" rel="noreferrer" className="group rounded-[26px] border border-stone-900/10 bg-white p-5 transition hover:-translate-y-1 hover:border-[#a34c35]/40 hover:shadow-lg"><span className="text-[9px] font-bold uppercase tracking-wider text-[#a34c35]">Evidence {String(index+1).padStart(2,"0")} · {source.type}</span><h3 className="mt-3 font-serif text-xl">{source.title}</h3>{source.organization&&<p className="mt-2 text-xs text-stone-500">{source.organization}</p>}<span className="mt-5 inline-block text-xs font-bold">Open source <span className="transition group-hover:translate-x-1">↗</span></span></a>)}</div></div>;
}

export default function HistoricalExperience({ sectionId, details, name, onAsk, onBack }) {
  useEffect(() => { window.requestAnimationFrame(() => document.querySelector(".experience-stage")?.scrollTo({ top: 0, behavior: "smooth" })); }, [sectionId]);
  const props=useMemo(()=>({details,name,onAsk,onBack}),[details,name,onAsk,onBack]);
  if(sectionId==="timeline") return <TimelineExperience {...props}/>;
  if(sectionId==="controversies") return <InvestigationExperience {...props}/>;
  if(sectionId==="documents") return <ArtifactExperience {...props}/>;
  if(sectionId==="ideas") return <IdeaExperience {...props}/>;
  if(sectionId==="relationships") return <RelationshipExperience {...props}/>;
  if(sectionId==="context"||sectionId==="legacy") return <SceneExperience {...props} type={sectionId}/>;
  if(sectionId==="conversationGuide") return <CuriosityExperience {...props}/>;
  if(sectionId==="sources") return <EvidenceExperience details={details} onBack={onBack}/>;
  return <ProfileExperience {...props}/>;
}
