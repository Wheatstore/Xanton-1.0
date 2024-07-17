import React, { useState } from "react";
import "./navbar.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { userSignOut } from "../../authenticationFunctions/signout";

function NavbarAuthenticated({ username }) {
    const navigate = useNavigate()
    const [user] = useAuthState(auth)
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const onSignOutClick = () => {
        try {
            userSignOut();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <nav className="navbar-container">
            <div className="navbar-header">
                <a href="/user" className="to-home-button-navbar">Xanton </a>
                <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="50" fill="#FF0080" rx="20" ry="20"/>
                    <text x="10" y="35" font-family="Inter" fontWeight="600" font-size="30" fill="white">BETA</text>
                </svg>
            </div>
            <div className="buttons-authenticated-container">
                <button className="help-button-support-button" onClick={() => navigate("/feedback")}>
                    <span class="material-symbols-outlined" id="help-button-support" >support</span>
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
        </nav>
    );
}

export default NavbarAuthenticated;
