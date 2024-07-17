import "./navbar.css"; // Import the navbar CSS
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function NavbarNotHome() {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <nav className="navbar-container">
            <div className="navbar-header"><a href="/" className="to-home-button-navbar">Xanton</a>
            <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="50" fill="#FF0080" rx="20" ry="20"/>
                    <text x="10" y="35" font-family="Inter" fontWeight="600" font-size="30" fill="white">BETA</text>
            </svg>
            </div>
            <div className="buttons-container">
                {location.pathname === "/signup" ? <button onClick={() => navigate("/login")} className="login-button-navbar">Login</button>: <button className="sign-up-button" onClick={() => navigate("/signup")}>Join</button>}
                <button type="button" className="learn-more-button-not-home-page">Learn more</button>
            </div>
        </nav>
    );
}

export default NavbarNotHome
