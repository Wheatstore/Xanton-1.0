import { Sidebar } from "../../components/chat-interface/chatExport"
import UserProfile from "../../components/userProfile/userProfile"
import "./userProfilePage.css"

function UserProfilePage(){
    return (
        <>
        <div className="user-profile-page-container">
            <div className="sidebar-container-user-profile-page">
                <Sidebar />
            </div>
            <div className="user-profile-container-user-profile-page">
                <UserProfile />
            </div>
        </div>
        </>
    )
    
}

export default UserProfilePage