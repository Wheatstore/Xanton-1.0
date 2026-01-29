import Login from "../../authenticationComponents/loginForm"
import { Helmet } from "react-helmet"
import Navbar from "../../components/navbar/navbar"

function LoginPage(){
    return (
        <>
            <Navbar />
            <Helmet>
                <title>Login to Xanton AI - Continue Your Journey</title>
                <meta name="description" content="Log in to Xanton AI and continue your immersive exploration of history. Engage with iconic figures and uncover new insights every time you visit." />
                <meta name="keywords" content="Xanton AI login, history learning, interactive history login, historical figures login" />
                <meta name="robots" content="noindex, nofollow" />
                <meta property="og:title" content="Login to Xanton AI - Continue Your Journey" />
                <meta property="og:description" content="Log in to Xanton AI and continue your immersive exploration of history. Engage with iconic figures and uncover new insights every time you visit." />
                <meta property="og:url" content="https://www.xantonai.com/login" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.xantonai.com/og-login-image.jpg" />
            </Helmet>
            <div className="login-page-home-container-div">
                <Login />
            </div>
        </>
    )
}

export default LoginPage