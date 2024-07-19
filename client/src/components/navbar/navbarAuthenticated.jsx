import React, { useState } from "react";
import "./navbarAuth.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { userSignOut } from "../../authenticationFunctions/signout";

function NavbarAuthenticated({ username }) {
    const location = useLocation()
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const onSignOutClick = () => {
        try {
            userSignOut();
        } catch (error) {
            console.error(error);
        }
    };

    const navigateToProfile = () => {
        navigate(`/profile/${user.displayName}`)
    }

    return (
        <nav className="navbar-container">
            <div className="navbar-header">
                <a href="/user" className="to-home-button-navbar">Xanton</a>
                <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="50" fill="#FF0080" rx="20" ry="20"/>
                    <text x="10" y="35" fontFamily="Inter" fontWeight="600" fontSize="30" fill="white">BETA</text>
                </svg>
                <button className="hamburger-menu" onClick={toggleSidebar}>
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </div>
            <div className={`buttons-authenticated-container ${isSidebarVisible ? 'active' : ''}`}>
                <button className="help-button-support-button" onClick={() => navigate("/feedback")}>
                    <span className="material-symbols-outlined" id="help-button-support">support</span>
                    Feedback
                </button>
                <button className="create-a-new-bot" onClick={() => navigate("/create-new-bot")}>Request a new bot</button>
                <button onClick={isSidebarVisible ?  navigateToProfile : toggleDropdown} className="profile-button">
                    <span className="material-symbols-outlined" id="account-circle-image-google-fonts">account_circle</span>
                    {isSidebarVisible && <h1>Profile</h1>}
                </button>
                {isDropdownVisible && (
                    <div className="dropdown-menu">
                        <img className="user-photoUrl-navbar-authenticated" src={user.photoURL} alt="user-profile" loading="lazy" />
                        <h3>Welcome {username}</h3>
                        <button onClick={onSignOutClick} className="dropdown-item">Sign Out <div><span className="material-symbols-outlined">logout</span></div></button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavbarAuthenticated;
