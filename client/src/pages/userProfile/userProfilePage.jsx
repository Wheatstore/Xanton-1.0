import UserProfile from "../../components/userProfile/userProfile";
import Navbar from "../../components/navbar/navbar";
import { MuseumFooter } from "../../components/museum/MuseumPage";
import "./userProfilePage.css";
export default function UserProfilePage() { return <div className="mp-page"><Navbar/><main className="profile-settings-page"><UserProfile/></main><MuseumFooter/></div>; }
