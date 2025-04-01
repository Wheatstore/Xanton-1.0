import Signup from "../../authenticationComponents/signupForm"
import "./signupPage.css"
import { Helmet } from "react-helmet"
import Navbar from "../../components/navbar/navbar"

function SignupPage(){
    return (
        <>
            <Navbar />
            <Helmet>
                <title>Sign Up for Xanton AI - Join and Explore History</title>
                <meta name="description" content="Create your account and embark on a captivating journey through time with Xanton AI. Chat with historical legends, learn from their experiences, and enjoy a personalized history learning experience." />
                <meta name="keywords" content="Xanton AI signup, history learning, interactive history signup, historical figures signup" />
                <meta name="robots" content="noindex, nofollow" />
                <meta property="og:title" content="Sign Up for Xanton AI - Join and Explore History" />
                <meta property="og:description" content="Create your account and embark on a captivating journey through time with Xanton AI. Chat with historical legends, learn from their experiences, and enjoy a personalized history learning experience." />
                <meta property="og:url" content="https://www.xantonai.com/signup" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.xantonai.com/og-signup-image.jpg" />
            </Helmet>
            <div className="signup-page-home-container">
                <Signup />
            </div>
        </>
    )
}

export default SignupPage