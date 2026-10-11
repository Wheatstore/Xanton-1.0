// Development-only component review. This is not a production route or an auth bypass.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import HistoricalExperience from "../src/components/chat-interface/character-info/HistoricalExperience";
import DirectoryFigureCard from "../src/components/BotsDirectory/DirectoryFigureCard";
import NewBotPage from "../src/pages/newBotPage/newBotPage";
import Submitted from "../src/pages/submitted/submitted";
import Admin from "../src/pages/admin/admin";
import { ProfileEditor } from "../src/components/userProfile/userProfile";
import "../src/pages/userProfile/userProfilePage.css";
import { MuseumFooter } from "../src/components/museum/MuseumPage";
import Navbar from "../src/components/navbar/navbar";
import "../src/App.css";
import "../src/components/chat-interface/workspace.css";
const details = {
  timeline: [{title:"An early chapter",dateDisplay:"1780",description:"Preview content to inspect the layout, chronology, and selected state.",significance:"This fixture checks how additional context appears."},{title:"A turning point",dateDisplay:"1800",description:"A second moment for checking navigation between timeline entries."}],
  documents:[{title:"A letter from the collection",documentType:"Letter",dateDisplay:"1800",summary:"Preview content for reviewing document selection and reading flow.",significance:"This is development fixture text, not a historical record."}],
  ideasAndBeliefs:[{topic:"A question of principle",summary:"Preview text for an idea and its context.",developmentOverTime:"Additional preview text revealed by the deeper-context control."},{topic:"A different perspective",summary:"A second idea to verify tab selection."}],
  relationships:[{personName:"A contemporary",relationshipType:"Colleague",description:"Preview text for a historical relationship."}],
  historicalContext:{worldBeforeTheirRise:"Preview context for the earliest scene.",worldDuringTheirLife:"A second scene for reviewing the selection interface."},
  legacy:{immediateImpact:"Preview content for the legacy reading view."},
  controversies:[{title:"A contested decision",summary:"Preview text for comparing interpretations.",majorInterpretations:["One interpretation to examine.","A second interpretation to consider."]}],
  profile:{fullName:"Preview figure",subtitle:"Component review"},biography:{short:"Preview biography text."},
  conversation:{suggestedQuestions:["What shaped your decisions?"],coreTopics:["Ideas"]},sources:[{title:"Preview source",type:"Reference",url:"#preview"}],
};
const sections=[['overview','Life story'],['timeline','Timeline'],['documents','Documents'],['ideas','Ideas'],['relationships','People'],['context','World'],['controversies','Debates'],['legacy','Legacy'],['sources','Sources'],['conversationGuide','Questions']];
function Preview(){
 const [section,setSection]=useState('timeline');const [question,setQuestion]=useState('');
 const mode=new URLSearchParams(window.location.search).get('view');
 if(mode==='profile')return <div className="mp-page"><Navbar/><main className="profile-settings-page"><ProfileEditor user={{displayName:'Preview member',email:'preview@example.com',photoURL:'/images/Default_pfp.svg.png',providerData:[{providerId:'password'}],metadata:{creationTime:'2026-01-01'}}}/></main><MuseumFooter/></div>;
 if(mode==='request')return <NewBotPage/>;
 if(mode==='submitted')return <Submitted/>;
 if(mode==='admin')return <Admin/>;
 if(mode==='directory')return <div className="mp-page"><Navbar/><main className="mp-section"><p className="mp-index">DEVELOPMENT FIXTURES · NOT LIVE COLLECTION DATA</p><div className="bd-grid">{[['George Washington','washington-480','President'],['Mahatma Gandhi','gandhi-480','Activist'],['Martin Luther King Jr.','mlk-480','Civil rights leader']].map(([name,img,role])=><DirectoryFigureCard key={name} figure={{id:'preview',name,role,img:`/images/${img}.webp`,description:'Preview card for checking the responsive directory layout.'}}/>)}</div></main><MuseumFooter/></div>;
 return <div className="mp-page immersive-chat"><Navbar/><main className="mp-section"><p className="mp-index">DEVELOPMENT FIXTURE · NOT A HISTORICAL RECORD</p><nav className="bd-filters" aria-label="Preview workspace tabs" style={{margin:'20px 0 30px'}}>{sections.map(([id,label])=><button key={id} className={section===id?'is-active':''} aria-pressed={section===id} onClick={()=>{setSection(id);setQuestion('');}}>{label}</button>)}</nav><div className="experience-stage"><HistoricalExperience key={section} sectionId={section} details={details} name="Preview figure" onAsk={setQuestion} onBack={()=>setSection('overview')}/></div>{question&&<p role="status">Selected question: {question}</p>}</main><MuseumFooter/></div>;
}
createRoot(document.getElementById('root')).render(<BrowserRouter><Preview/></BrowserRouter>);
