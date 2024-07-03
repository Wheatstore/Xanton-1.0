import Login from "../../authenticationComponents/loginForm"
import NavbarNotHome from "../../components/navbar/navbarNotHome"
import "./loginPage.css"

function LoginPage(){
    return (
        <>
            <div className="login-page-home-container-div">
                <NavbarNotHome />
                <Login />
            </div>
        </>
    )
}

export default LoginPage