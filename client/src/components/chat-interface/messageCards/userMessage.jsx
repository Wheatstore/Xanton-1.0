import "./messageCard.css";

function UserMessage({ userMessage }) {
    return (
        <div className="message-container-container">
            <div className="message-container">
                <p className="user-message-content">{userMessage}</p>
        </div>
        </div>
    );
}

export default UserMessage;
