import { useAuthState } from "react-firebase-hooks/auth"
import "./userProfile.css"
import { auth } from "../../firebase"
import { useState } from "react"
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function UserProfile(){
    const [user] = useAuthState(auth)
    const [username, setUsername] = useState(user.displayName)
    const [usernameCount, setUsernameCount] = useState(0)
    const [showButton, setShowButton] = useState(false)
    const [bio, setBio] = useState("")
    const [feedback, setFeedback] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleUsernameInput = (e) => {
        try {
            setShowButton(true)
            if (e.target.value.length > 25){
                setError("Username is too long")
            } 
            setUsername(e.target.value)
            setUsernameCount(usernameCount + 1)
        }catch (error){
            console.error(error)
        }
    }

    const handleButtonSubmit = async () => {
        if (usernameCount >= 1){
            await updateProfile(user, {displayName: username})
        }
        navigate("/user")
    }

    const handleCancelButton = () => {
        setUsername(user.displayName)
        setBio("")
        setFeedback("")
    }

    return (
        <div className="user-information-edit-container">
            <div className="heading-container-user-information-edit">
                <h1>Public Profile</h1>
            </div>
            <div className="user-information-user-information-edit">
                <img src={user.photoURL} alt="" />
                <h1>{user.displayName}</h1>
            </div>
            <div className="user-information-user-information-input-container">
                <textarea className="user-username-input-container" onChange={handleUsernameInput} value={username} type="text" placeholder={`${user.displayName}`}/>
                <textarea placeholder="Bio" className="user-bio-input-container" onChange={(e) => setBio(e.target.value) || setShowButton(true)} value={bio}></textarea>
                <textarea className="feedback-text-area-container" onChange={(e) => setFeedback(e.target.value) || setShowButton(true)} value={feedback} placeholder="Feedback"></textarea>
            </div>

            <div className="button-container-user-profile">
                <button className="button-user-profile-cancel"onClick={handleCancelButton}>Cancel</button> 
                <button className="button-user-profile-save" onClick={handleButtonSubmit}>Save</button>
            </div>
            
        </div>
    )

}

export default UserProfile