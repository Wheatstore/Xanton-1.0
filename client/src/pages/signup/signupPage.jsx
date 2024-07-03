import Signup from "../../authenticationComponents/signupForm"
import NavbarNotHome from "../../components/navbar/navbarNotHome"
import "./signupPage.css"

function SignupPage(){
    return (
        <>
            <div className="signup-page-home-container">
                <NavbarNotHome/>
                <Signup />
            </div>
        </>
    )
}

export default SignupPage