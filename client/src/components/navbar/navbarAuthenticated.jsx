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
            <div className="inner-navbar-heading-auth">
                <div className="navbar-header">
                    <a href="/" className="to-home-button-navbar">
                        <img src="/images/logo.png" alt="Xanton Logo" />
                    </a>
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
            </div>
            <div className="button-hamburger-container">
                <button className="hamburger-menu" onClick={toggleSidebar}>
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </div>
        </nav>
    );
}

export default NavbarAuthenticated;
