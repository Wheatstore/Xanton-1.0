import { useNavigate } from "react-router-dom";
import { BookOpen, Compass, MessageSquareText, Search, ShieldCheck, Sparkles } from "lucide-react";
import Navbar from "../../components/navbar/navbar";
import { MuseumCTA, MuseumFooter, MuseumPageHero } from "../../components/museum/MuseumPage";

const features=[
  {icon:<MessageSquareText/>,title:"Conversations with history",text:"Ask about a figure’s decisions, ideas, and experiences in a natural AI conversation inspired by their documented life."},
  {icon:<Compass/>,title:"Find your next curiosity",text:"Browse figures from different eras and fields. Search by name, profession, or the ideas that interest you."},
  {icon:<BookOpen/>,title:"See the whole life",text:"Follow timelines, explore documents, and meet the people who influenced a figure’s world."},
  {icon:<Search/>,title:"A place to begin",text:"Suggested questions help you get started. Take the conversation wherever your curiosity leads."},
  {icon:<ShieldCheck/>,title:"Read with perspective",text:"AI responses can be imperfect. Use conversations to open new questions, and verify important claims with reliable sources."},
  {icon:<Sparkles/>,title:"Room to explore",text:"Keep your attention on the person, the story, and the question. Explore at your own pace."},
];

export default function Features(){const navigate=useNavigate();return <div className="mp-page"><Navbar/><MuseumPageHero index="01" eyebrow="THE EXPERIENCE" title="A little closer" italic="to the past." description="Meet historical figures through AI conversations, then explore the events, documents, and ideas that shaped their lives." image="/images/page-features-cabinet.webp" imageAlt="A sunlit curiosity cabinet filled with books, a globe, shells, and a telescope"><button className="mp-button" onClick={()=>navigate('/bots')}>Explore the figures</button></MuseumPageHero>
  <section className="mp-section mp-section-light"><div className="mp-section-heading"><p className="mp-index">THE EXPERIENCE</p><h2>More ways to follow a life.</h2></div><div className="feature-ledger">{features.map((feature,index)=><article key={feature.title}><div>{feature.icon}</div><span>0{index+1}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></section>
  <section className="feature-stage"><div><p className="mp-index">HOW IT WORKS</p><h2>Look closely.<br/><em>Ask freely.</em><br/>Read further.</h2></div><ol><li><span>I</span><div><strong>Meet a figure</strong><p>Begin with portrait, biography, and period context.</p></div></li><li><span>II</span><div><strong>Open the conversation</strong><p>Follow the question that feels most alive to you.</p></div></li><li><span>III</span><div><strong>Return to the record</strong><p>Use the exchange as a path into further reading.</p></div></li></ol></section>
  <MuseumCTA title="Start with a person. Follow a question."/><MuseumFooter/></div>}
