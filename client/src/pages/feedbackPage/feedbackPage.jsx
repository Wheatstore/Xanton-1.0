import Feedback from "../../components/feedback/feedback"
import "./feedbackPage.css"
import NavbarAuthenticated from "../../components/navbar/navbarAuthenticated"
import Footer from "../../components/footer/footer"

function FeedbackPage(){
    return (
        <>
            <div className="feedback-page-container">
                <NavbarAuthenticated />
                <Feedback />
                <Footer />
            </div>
        </>
    )
}

export default FeedbackPage