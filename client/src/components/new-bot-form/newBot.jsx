import "./newBot.css"
import axios from "axios"
import { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate } from "react-router-dom"
import { auth } from "../../firebase"

function NewBot(){
    const navigate = useNavigate()
    const [user] = useAuthState(auth)
    const [name, setName] = useState("")
    const [greeting, setGreeting] = useState("")
    const [description, setDescription] = useState("")
    const [aMessage, setAMessage] = useState("")

    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/create-new-bot", {
                name: name,
                creator: user.displayName,
                creatorId: user.uid,
                greeting: greeting,
                description: description,
                additionalMessage: aMessage
            })
            if (response.status === 200){
                navigate("/user")
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
        <div className="new-bot-container">
            <h2>Create a New Bot</h2>
            <form className="new-bot-form">
                <div className="form-group">
                    <label htmlFor="botName">Historical Figure Name</label>
                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" id="botName" placeholder="Eg. Albert Einstein" name="botName" required />
                </div>
                <div className="form-group">
                <label htmlFor="botDescription">Greeting</label>
                <textarea  onChange={(e) => setGreeting(e.target.value)} value={greeting} id="botGreeting" placeholder="How your bot will greet the user" name="botDescription" required></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="botDescription">Description</label>
                    <textarea  onChange={(e) => setDescription(e.target.value)} value={description} id="botDescription" placeholder="Describe what your bot will be like" name="botDescription" required></textarea>
                </div>
                <label htmlFor="botDescription">Additional message</label>
                    <textarea id="botMessage"  onChange={(e) => setAMessage(e.target.value)} value={aMessage} placeholder="Write an additonal message" name="botDescription"></textarea>
                <div className="create-bot-submit-container">
                    <button type="button" onClick={handleSubmit}>Create Bot</button>
                </div>
            </form>
        </div>            
        </>
    )
}

export default NewBot