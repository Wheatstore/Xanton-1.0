import Feedback from "../../components/feedback/feedback"
import Footer from "../../components/landing/footer/footer"
import Navbar from "../../components/navbar/navbar"

function FeedbackPage(){
    return (
        <>
            <div className="feedback-page-container">
                <Navbar />
                <Feedback />
                <Footer />
            </div>
        </>
    )
}

export default FeedbackPage