import { Helmet } from "react-helmet-async";
import Feedback from "../../components/feedback/feedback";
import Navbar from "../../components/navbar/navbar";
import { MuseumFooter } from "../../components/museum/MuseumPage";
export default function FeedbackPage(){return <div className="mp-page"><Helmet><title>Visitor Correspondence | Echoes of History</title><meta name="description" content="Share an observation or suggestion with the Echoes of History archive."/><link rel="canonical" href="https://echoesofhistoryai.org/feedback"/></Helmet><Navbar/><Feedback/><MuseumFooter/></div>}
