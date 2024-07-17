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
            <div className="navbar-header"><a href="/" className="to-home-button-navbar">Xanton</a>
            <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="50" fill="#FF0080" rx="20" ry="20"/>
                    <text x="10" y="35" fontFamily="Inter" fontWeight="600" fontSize="30" fill="white">BETA</text>
                </svg>
            </div>
            <div className="buttons-container">
                <button onClick={navigateLogin} className="login-button-navbar">Login</button>
                <button className="sign-up-button" onClick={navigateSignup}>Join</button>
            </div>
        </nav>
    );
}

export default NavbarHome;
