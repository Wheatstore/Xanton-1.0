import "./navbar.css"; // Import the navbar CSS
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function NavbarNotHome() {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <nav className="navbar-container">
            <div className="navbar-header"><a href="/" className="to-home-button-navbar">Xanton</a></div>
            <div className="buttons-container">
                {location.pathname === "/signup" ? <button onClick={() => navigate("/login")} className="login-button-navbar">Login</button>: <button className="sign-up-button" onClick={() => navigate("/signup")}>Join</button>}
                <button type="button" className="learn-more-button-not-home-page">Learn more</button>
            </div>
        </nav>
    );
}

export default NavbarNotHome
