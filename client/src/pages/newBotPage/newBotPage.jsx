import Footer from "../../components/landing/footer/footer"
import Navbar from "../../components/navbar/navbar"
import NewBot from "../../components/new-bot-form/newBot"

function NewBotPage(){
    return (
        <>
            <div className="new-bot-page-container">
                <div className="new-bot-form-page-container">
                    <Navbar/>
                    <NewBot />
                </div>
                <Footer />
            </div>
        </>
    )
}

export default NewBotPage