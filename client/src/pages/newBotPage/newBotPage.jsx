import NavbarAuthenticated from "../../components/navbar/navbarAuthenticated"
import NewBot from "../../components/new-bot-form/newBot"
import NewBotGuidelines from "../../components/new-bot-form/newBotGuidlines"
import "./newBotPage.css"

function NewBotPage(){
    return (
        <>
            <div className="new-bot-page-container">
                <NavbarAuthenticated />
                <div className="new-bot-form-page-container">
                    <NewBot />
                    <NewBotGuidelines />
                </div>
            </div>
        </>
    )
}

export default NewBotPage