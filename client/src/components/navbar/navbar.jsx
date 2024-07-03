import "./navbar.css"; // Import the navbar CSS
import { useNavigate } from "react-router-dom";

function NavbarHome() {
    const navigate = useNavigate()

    const navigateLogin = () => {
        navigate("/login")
    }

    const navigateSignup = () => {
        navigate("/signup")
    }

    return (
        <nav className="navbar-container">
            <div className="navbar-header"><a href="/" className="to-home-button-navbar">Xanton</a></div>
            <div className="buttons-container">
                <button onClick={navigateLogin} className="login-button-navbar">Login</button>
                <button className="sign-up-button" onClick={navigateSignup}>Join</button>
            </div>
        </nav>
    );
}

export default NavbarHome;
