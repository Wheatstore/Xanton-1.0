/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
// Development-only presentation fixtures. No authentication override, SDK writes, or API calls.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ChatWorkspace from '../src/components/chat-interface/ChatWorkspace';
import { ConversationNavigation } from '../src/components/chat-interface/sidebar/sidebar';
import { FigureCollection } from '../src/components/BotsDirectory/BotsDirectory';
import Navbar from '../src/components/navbar/navbar';
import { MuseumFooter } from '../src/components/museum/MuseumPage';
import '../src/App.css';
const figures = [
 {id:'gandhi',name:'Mahatma Gandhi',img:'/images/gandhi-480.webp',role:'Activist · India',description:'Explore ideas of nonviolent resistance and the choices that shape a movement.',years:'1869–1948'},
 {id:'washington',name:'George Washington',img:'/images/washington-480.webp',role:'President · United States',description:'Leadership, revolution, and the making of a new nation.',years:'1732–1799'},
 {id:'mlk',name:'Martin Luther King Jr.',img:'/images/mlk-480.webp',profile:{occupations:['Civil rights leader'],nationalities:['United States']},biography:{short:'A voice for civil rights, justice, and social change.'},years:'1929–1968'},
 {id:'genghis',name:'Genghis Khan',img:'/images/genghis-nobg.png',profile:{occupations:['Emperor'],eras:['13th century']},biography:{short:'Explore leadership, empire, and a changing world.'}},
];
const details={
 profile:{fullName:'Mahatma Gandhi',subtitle:'Activist · India · 1869–1948',birthDateDisplay:'1869',birthPlace:'Porbandar, India',deathDateDisplay:'1948',occupations:['Activist'],eras:['19th–20th century']},
 biography:{short:'Explore nonviolent resistance, personal conviction, and the choices that shape a movement.',detailed:'This is development fixture content for reviewing the UI. It is not a complete historical record.',historicalImportance:'The fixture lets us verify the full biography disclosure.'},
 timeline:[
  {title:'An early chapter',dateDisplay:'1869',location:'Preview location',category:'Early life',description:'Development fixture content, not a historical account. This moment introduces the chronological record.',significance:'A short explanation helps readers see why a recorded event belongs in the story.'},
  {title:'Learning and discovery',dateDisplay:'1888',category:'Education',description:'Development fixture content for checking how a second event appears along the line.'},
  {title:'A different world',dateDisplay:'1893',category:'Journeys',description:'Development fixture content for checking a journey on the timeline.',significance:'The selected date and the event remain connected as you explore.'},
  {title:'An idea takes shape',dateDisplay:'1906',category:'Ideas',description:'Development fixture content for an event with a longer account. '+ 'This additional paragraph is included to verify that the reader can expand the complete record without losing the selected date. '.repeat(4)},
  {title:'A turning point',dateDisplay:'1915',category:'Public life',description:'Development fixture content for testing navigation between moments.'},
  {title:'A defining moment',dateDisplay:'1930',category:'Public life',description:'Development fixture content for inspecting a selected later moment.',significance:'The record can distinguish what happened from why it mattered.'},
  {title:'A changing world',dateDisplay:'1947',category:'Later life',description:'Development fixture content for testing navigation near the end of the timeline.'},
  {title:'The final chapter',dateDisplay:'1948',category:'Later life',description:'Development fixture content for checking the last event and disabled next control.'},
 ],
 documents:[{title:'A letter from the collection',documentType:'Letter',dateDisplay:'1930',summary:'Development fixture content for reviewing document selection.',significance:'This is not a historical document.'}],
 ideasAndBeliefs:[{topic:'Nonviolent resistance',summary:'Development fixture text for reviewing an idea.',developmentOverTime:'Additional fixture context.'},{topic:'Personal conviction',summary:'A second fixture idea.'}],
 relationships:[{personName:'A contemporary',relationshipType:'Colleague',description:'Fixture relationship text.'},{personName:'An early influence',relationshipType:'Mentor',description:'Development fixture for a different kind of connection.'},{personName:'A fellow organizer',relationshipType:'Colleague',description:'Development fixture for filtering more than one connection.'}],
 historicalContext:{worldBeforeTheirRise:'Fixture context for an early scene.',worldDuringTheirLife:'Fixture context for a later scene.'},
 controversies:[{title:'A contested decision',summary:'Fixture text for comparing interpretations.',majorInterpretations:['One interpretation.','Another interpretation.']}],
 legacy:{immediateImpact:'Development fixture for the immediate impact view.',longTermImpact:'Development fixture for comparing a longer perspective.',modernReputation:'Development fixture for reviewing how interpretations change.'},
 sources:[{title:'Preview reference',organization:'Development fixture',type:'Reference',url:'https://example.com'},{title:'An archive catalogue',organization:'Preview archive',type:'Archive',url:'https://example.com/archive'},{title:'An offline reference',organization:'Preview library',type:'Reference'}],
 conversation:{suggestedQuestions:['What decision changed your life?','What did nonviolence mean to you?','How did you respond to doubt?'],coreTopics:['Nonviolent resistance'],personalityDescription:'Development fixture for the portrayal description.',speakingStyle:'Development fixture for speaking style.',knowledgeLimitations:['AI portrayal may simplify historical nuance.']},
};
function Preview(){
 const view=new URLSearchParams(window.location.search).get('view');
 const [sendError,setSendError]=useState('');
 const [messages,setMessages]=useState(view==='long-thread'?Array.from({length:8},(_,index)=>({id:`fixture-${index}`,message:`Preview question ${index+1}: what shaped your ideas?`,reply:'This is development fixture content for reviewing a longer conversation. It is not a historical account.\n\n**Room to follow an idea.** A longer reply gives us a way to check reading position, keyboard scrolling, and returning from historical chapters without losing our place.\n\n- Open a chapter for more context.\n- Return to the conversation whenever you are ready.'})):view==='thread'?[{id:'example',message:'What did nonviolence mean to you?',reply:'This is a development preview of a character reply.\n\n**A readable conversation** keeps the question and response together, with enough room to follow an idea.\n\n- Explore the history when you want more context.\n- Return to the conversation to ask a question.'}]:[]);
 if(view==='gallery'||view==='empty'||view==='gallery-error'||view==='gallery-loading')return <div className="mp-page"><Navbar/><FigureCollection figures={view==='empty'?[]:figures} loading={view==='gallery-loading'} loadError={view==='gallery-error'} onRetry={()=>{}}/><MuseumFooter/></div>;
 return <ChatWorkspace details={details} name="Mahatma Gandhi" image="/images/gandhi-480.webp" messages={view==='pending'?[{id:'pending',message:'A preview question.',pendingReply:true}]:messages} sending={view==='pending'} sendError={sendError} loading={view==='loading'} loadError={view==='error'?'Fixture connection unavailable. No live data is used in this preview.':''} onSend={async text=>{if(view==='send-error'){setSendError('Preview failure: your question is ready to send again.');return false;}setMessages(items=>[...items,{id:Date.now(),message:text,reply:'This is a local design preview reply. Live character responses use the existing authenticated chat service.'}]);return true;}} navigation={<ConversationNavigation user={{displayName:'Preview reader'}} activeCharacter={{id:'gandhi'}} chats={figures.map(figure=>({...figure,character:figure.id}))} onSignOut={()=>{}}/>}/>;
}
const root = import.meta.hot?.data.root || createRoot(document.getElementById('root'));
root.render(<BrowserRouter><Preview/></BrowserRouter>);
if (import.meta.hot) { import.meta.hot.data.root = root; import.meta.hot.accept(); }
