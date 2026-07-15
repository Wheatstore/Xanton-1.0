import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BookOpen, Compass, MessageSquareText, Search, ShieldCheck, Sparkles } from "lucide-react";
import Navbar from "../../components/navbar/navbar";
import { MuseumCTA, MuseumFooter, MuseumPageHero } from "../../components/museum/MuseumPage";

const features=[
  {icon:<MessageSquareText/>,title:"Conversation as interpretation",text:"Ask about motives, private doubts, turning points, and consequences in a natural exchange shaped by a figure's documented life."},
  {icon:<Compass/>,title:"A collection built for wandering",text:"Move between eras and disciplines through a portrait-led archive designed to reward curiosity rather than completion."},
  {icon:<BookOpen/>,title:"Context before spectacle",text:"Biographical framing and historically grounded prompts help each conversation begin with the world the figure actually inhabited."},
  {icon:<Search/>,title:"Questions with depth",text:"Suggested lines of inquiry move past trivia and toward conflict, influence, legacy, and the limits of historical memory."},
  {icon:<ShieldCheck/>,title:"Interpretation made visible",text:"Clear notices remind visitors that conversational responses can be imperfect and should lead back to trusted sources."},
  {icon:<Sparkles/>,title:"A quieter kind of discovery",text:"No scores, streaks, or noisy dashboards. The interface gives attention back to portraits, words, and sustained thought."},
];

export default function Features(){const navigate=useNavigate();return <div className="mp-page"><Helmet><title>The Experience | Echoes of History</title><meta name="description" content="Discover how Echoes of History turns historical inquiry into immersive conversation."/></Helmet><Navbar/><MuseumPageHero index="01" eyebrow="THE EXPERIENCE" title="Designed for" italic="historical curiosity." description="The product is not a showcase of technology. It is a set of carefully designed conditions for asking better questions of the past." image="/images/art3.png" imageAlt="Architectural study of an Ionic column with geometric forms"><button className="mp-button" onClick={()=>navigate('/signup')}>Begin a visit</button></MuseumPageHero>
  <section className="mp-section mp-section-light"><div className="mp-section-heading"><p className="mp-index">02 / THE PRINCIPLES</p><h2>Everything serves the encounter.</h2></div><div className="feature-ledger">{features.map((feature,index)=><article key={feature.title}><div>{feature.icon}</div><span>0{index+1}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></section>
  <section className="feature-stage"><div><p className="mp-index">03 / A VISIT IN THREE MOVEMENTS</p><h2>Look closely.<br/><em>Ask freely.</em><br/>Read further.</h2></div><ol><li><span>I</span><div><strong>Meet a figure</strong><p>Begin with portrait, biography, and period context.</p></div></li><li><span>II</span><div><strong>Open the conversation</strong><p>Follow the question that feels most alive to you.</p></div></li><li><span>III</span><div><strong>Return to the record</strong><p>Use the exchange as a path into further reading.</p></div></li></ol></section>
  <MuseumCTA title="The past is waiting for a better question."/><MuseumFooter/></div>}
