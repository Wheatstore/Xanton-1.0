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
 timeline:[{title:'An early chapter',dateDisplay:'1869',description:'Development fixture text for inspecting the selected moment.'},{title:'A turning point',dateDisplay:'1915',description:'A second fixture moment for testing timeline navigation.'}],
 documents:[{title:'A letter from the collection',documentType:'Letter',dateDisplay:'1930',summary:'Development fixture content for reviewing document selection.',significance:'This is not a historical document.'}],
 ideasAndBeliefs:[{topic:'Nonviolent resistance',summary:'Development fixture text for reviewing an idea.',developmentOverTime:'Additional fixture context.'},{topic:'Personal conviction',summary:'A second fixture idea.'}],
 relationships:[{personName:'A contemporary',relationshipType:'Colleague',description:'Fixture relationship text.'}],
 historicalContext:{worldBeforeTheirRise:'Fixture context for an early scene.',worldDuringTheirLife:'Fixture context for a later scene.'},
 controversies:[{title:'A contested decision',summary:'Fixture text for comparing interpretations.',majorInterpretations:['One interpretation.','Another interpretation.']}],
 legacy:{immediateImpact:'Development fixture for the legacy view.'},
 sources:[{title:'Preview reference',organization:'Development fixture',type:'Reference',url:'https://example.com'}],
 conversation:{suggestedQuestions:['What decision changed your life?','What did nonviolence mean to you?','How did you respond to doubt?'],coreTopics:['Nonviolent resistance'],personalityDescription:'Development fixture for the portrayal description.',speakingStyle:'Development fixture for speaking style.',knowledgeLimitations:['AI portrayal may simplify historical nuance.']},
};
function Preview(){
 const view=new URLSearchParams(window.location.search).get('view');
 const [sendError,setSendError]=useState('');
 const [messages,setMessages]=useState(view==='thread'?[{id:'example',message:'What did nonviolence mean to you?',reply:'This is a development preview of a character reply.\n\n**A readable conversation** keeps the question and response together, with enough room to follow an idea.\n\n- Explore the history when you want more context.\n- Return to the conversation to ask a question.'}]:[]);
 if(view==='gallery'||view==='empty'||view==='gallery-error'||view==='gallery-loading')return <div className="mp-page"><Navbar/><FigureCollection figures={view==='empty'?[]:figures} loading={view==='gallery-loading'} loadError={view==='gallery-error'} onRetry={()=>{}}/><MuseumFooter/></div>;
 return <ChatWorkspace details={details} name="Mahatma Gandhi" image="/images/gandhi-480.webp" messages={view==='pending'?[{id:'pending',message:'A preview question.',pendingReply:true}]:messages} sending={view==='pending'} sendError={sendError} loading={view==='loading'} loadError={view==='error'?'Fixture connection unavailable. No live data is used in this preview.':''} onSend={async text=>{if(view==='send-error'){setSendError('Preview failure: your question is ready to send again.');return false;}setMessages(items=>[...items,{id:Date.now(),message:text,reply:'This is a local design preview reply. Live character responses use the existing authenticated chat service.'}]);return true;}} navigation={<ConversationNavigation user={{displayName:'Preview reader'}} activeCharacter={{id:'gandhi'}} chats={figures.map(figure=>({...figure,character:figure.id}))} onSignOut={()=>{}}/>}/>;
}
const root = import.meta.hot?.data.root || createRoot(document.getElementById('root'));
root.render(<BrowserRouter><Preview/></BrowserRouter>);
if (import.meta.hot) { import.meta.hot.data.root = root; import.meta.hot.accept(); }
