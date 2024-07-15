import { useState } from "react"
import "./feedback.css"

function Feedback(){
    const [inputFeedback, setInput] = useState("")
    const [email, setEmail] = useState("")
    const [feedbackDescription, setDescription] = useState("")

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
                    <button>Submit</button>
                </div>
            </div>    
        </>
    )
}

export default Feedback