import { useState } from "react"
import "./feedback.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../../firebase"

function Feedback(){
    const [user] = useAuthState(auth)
    const navigate = useNavigate()
    const [inputFeedback, setInput] = useState("")
    const [email, setEmail] = useState("")
    const [feedbackDescription, setDescription] = useState("")

    const sendFeedback = async () => {
        try {
            const body = {
                sender: user,
                title: inputFeedback,
                email: email,
                description: feedbackDescription
            }
            const response = await axios.post("https://xanton-1-0-server.vercel.app/api/feedback", body)
            if (response.status === 200){
                navigate("/user")
            }
        } catch (error){
            console.error("There was an error submiting feedback", error)
        }
    }

    return (
        <>
            <div className="feedback-form-container">
                <div className="feedback-heading-container">
                    <h1>Help us improve the site</h1>
                    <h2>All requests, feedback, and just submissions will be closely considered and worked upon by me. Please be honest and truthful</h2>
                </div>
                <div className="feedback-form-container-form">
                    <input placeholder="Title the problem" type="text" onChange={(e) => setInput(e.target.value)} value={inputFeedback} required/>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="What is an email so that I can contact you further if needed"/>
                    <textarea onChange={(e) => setDescription(e.target.value)} value={feedbackDescription} placeholder="Describe the problem in detail..." required></textarea>
                    <button onClick={sendFeedback}>Submit</button>
                </div>
                <div className="contact-support-div">
                    <h3><span class="material-symbols-outlined">mail</span> support@xantonai.com</h3>
                </div>
            </div>    
        </>
    )
}

export default Feedback