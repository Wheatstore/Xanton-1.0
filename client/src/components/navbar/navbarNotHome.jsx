import "./navbarNotHome.css"
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function NavbarNotHome() {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <nav className="navbar-container">
            <div className="inner-navbar-container-div-nothome">
                <div className="navbar-header">
                    <a href="/" className="to-home-button-navbar">
                            <img src="/images/logo.png" alt="Xanton AI" />
                    </a>
                </div>
                <div className="buttons-container">
                    {location.pathname === "/signup" ? <button onClick={() => navigate("/login")} className="login-button-navbar">Login</button>: <button className="sign-up-button" onClick={() => navigate("/signup")}>Join</button>}
                    <button onClick={() => navigate("/about")}  className="about-button-landing">About</button>
                    <button onClick={() => navigate("/team")} className="meet-team-button-landing">Meet the Team</button>
                    <button onClick={() => navigate("/blog")} className="blog-team-button">Blog</button>
                </div>
            </div>
        </nav>
    );
}

export default NavbarNotHome
