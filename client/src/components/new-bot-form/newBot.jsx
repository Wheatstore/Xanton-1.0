import "./newBot.css"
import axios from "axios"

function NewBot(){
    return (
        <>
        <div className="new-bot-container">
            <h2>Create a New Bot</h2>
            <form className="new-bot-form">
                <div className="form-group">
                    <label htmlFor="botName">Bot Name</label>
                    <input type="text" id="botName" name="botName" required />
                </div>
                <div className="form-group">
                    <label htmlFor="botDescription">Bot Description</label>
                    <textarea id="botDescription" name="botDescription" required></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="apiEndpoint">API Endpoint</label>
                    <input type="url" id="apiEndpoint" name="apiEndpoint" required />
                </div>
                <button type="submit">Create Bot</button>
            </form>
        </div>            
        </>
    )
}

export default NewBot