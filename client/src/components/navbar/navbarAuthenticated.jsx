import React, { useState } from "react";
import "./navbar.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { userSignOut } from "../../authenticationFunctions/signout";

function NavbarAuthenticated({ username }) {
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

    return (
        <>
            <nav className="navbar-container">
                <div className="navbar-header">
                    <a href="/user" className="to-home-button-navbar">Xanton</a>
                </div>
                <div className="buttons-authenticated-container">
                    <button className="help-button-support-button" onClick={() => navigate("/feedback")}>
                        <span className="material-symbols-outlined" id="help-button-support">support</span>
                        Feedback
                    </button>
                    <button className="create-a-new-bot" onClick={() => navigate("/create-new-bot")}>Request a new bot</button>
                    <button onClick={toggleDropdown} className="profile-button">
                        <span className="material-symbols-outlined" id="account-circle-image-google-fonts">account_circle</span>
                    </button>
                    {isDropdownVisible && (
                        <div className="dropdown-menu">
                            <img className="user-photoUrl-navbar-authenticated" src={user.photoURL} alt="user-profile" />
                            <h3>Welcome {username}</h3>
                            <button onClick={onSignOutClick} className="dropdown-item">Sign Out <div><span className="material-symbols-outlined">logout</span></div></button>
                        </div>
                    )}
                </div>
                <div className="hamburger-menu" onClick={toggleSidebar}>
                    &#9776;
                </div>
            </nav>
            <div className={`sidebar ${isSidebarVisible ? 'visible' : ''}`}>
                <span className="close-btn" onClick={toggleSidebar}>&times;</span>
                <a href="/user" onClick={toggleSidebar}>Home</a>
                <button onClick={() => { navigate("/feedback"); toggleSidebar(); }}>Feedback</button>
                <button onClick={() => { navigate("/create-new-bot"); toggleSidebar(); }}>Request a new bot</button>
                <button onClick={onSignOutClick} className="dropdown-item">Sign Out <div><span className="material-symbols-outlined">logout</span></div></button>
            </div>
        </>
    );
}

export default NavbarAuthenticated;
