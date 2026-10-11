/* eslint-disable react/prop-types */
import { MuseumFooter } from "../components/museum/MuseumPage";
import "./auth.css";

export default function AuthLayout({ signup = false, children }) {
  return <div className="mp-page"><div className="auth-archive">
    <aside className={`auth-art ${signup ? "auth-art-blue" : ""}`}>
      <img src={signup ? "/images/page-signup-garden.webp" : "/images/page-login-window.webp"} alt={signup ? "An open garden gate with flowers and a path toward a library" : "A painted reading room with an open window looking onto a garden"}/>
      <div><p className="mp-index">{signup ? "FOLLOW YOUR CURIOSITY" : "A WORLD STILL WAITING TO BE EXPLORED"}</p><h1>{signup ? <>Every life holds{" "}<br/>a story.</> : <>Pick up where{" "}<br/>curiosity left off.</>}</h1><p>{signup ? "Meet the people behind the dates. Ask the questions you’ve always wondered about." : "Return to your conversations, explore another life, and see history from a new perspective."}</p></div>
      <span className="auth-art-credit">Illustrative artwork · Echoes of History</span>
    </aside>
    <main className="auth-main">{children}</main>
  </div><MuseumFooter/></div>;
}
