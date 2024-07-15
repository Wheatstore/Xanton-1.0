import Feedback from "../../components/feedback/feedback"
import "./feedbackPage.css"
import NavbarAuthenticated from "../../components/navbar/navbarAuthenticated"

function FeedbackPage(){
    return (
        <>
            <div className="feedback-page-container">
                <NavbarAuthenticated />
                <Feedback />
            </div>
        </>
    )
}

export default FeedbackPage