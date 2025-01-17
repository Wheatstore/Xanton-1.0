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
        <nav className="navbar-container-home">
            <div className="inner-navbar-container-div">
                <div className="navbar-header">
                    <a href="/" className="to-home-button-navbar">
                        <img src="/images/logo.png" alt="Xanton AI" />
                    </a>
                </div>
                <div className="buttons-container">
                    <button onClick={navigateLogin} className="login-button-navbar-home">Login</button>
                    <button className="sign-up-button" onClick={navigateSignup}>Join</button>
                    <button onClick={() => navigate("/about")}  className="about-button-landing">About</button>
                    <button onClick={() => navigate("/team")} className="meet-team-button-landing">Meet the Team</button>
                    <button onClick={() => navigate("/blog")} className="blog-team-button">Blog</button>
                </div>  
            </div>
        </nav>
    );
}

export default NavbarHome;
