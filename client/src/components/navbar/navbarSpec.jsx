import "./navbar.css"; // Import the navbar CSS
import { useNavigate } from "react-router-dom";

function NavbarSpec() {
    const navigate = useNavigate()

    return (
        <nav className="navbar-container-home">
            <div className="inner-navbar-container-div">
                <div className="navbar-header">
                    <a href="/" className="to-home-button-navbar">
                        <img src="/images/logo.png" alt="Xanton Logo" />
                    </a>
                </div>
                <div className="buttons-container">
                    <button onClick={() => navigate("/about")}  className="about-button-landing">About</button>
                    <button onClick={() => navigate("/team")} className="meet-team-button-landing">Meet the Team</button>
                </div>  
            </div>
        </nav>
    );
}

export default NavbarSpec
