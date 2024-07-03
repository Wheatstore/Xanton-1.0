import "./messageCard.css";

function BotMessage({ image, botMessage }) {
    return (
        <div className="botMessage-container">
            <div className="botMessage-image-container">
                <img src={image} className="botMessage-image" alt="" />
            </div>
            <p className="botMessage-content">{botMessage}</p>
        </div>
    );
}

export default BotMessage;
