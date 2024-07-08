import { useAuthState } from "react-firebase-hooks/auth"
import "./userProfile.css"
import { auth } from "../../firebase"
import { useState } from "react"

function UserProfile(){
    const [username, setUsername] = useState("")
    const [user] = useAuthState(auth)

    return (
        <div className="user-information-edit-container">
            <div className="heading-container-user-information-edit">
                <h1>Public Profile</h1>
            </div>
            <div className="user-information-user-information-edit">
                <img src={user.photoURL} alt="" />
                <h1>{user.displayName}</h1>
                <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" placeholder="Edit username" />
            </div>
        </div>
    )

}

export default UserProfile