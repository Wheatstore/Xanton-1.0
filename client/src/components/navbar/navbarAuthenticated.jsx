import React, { useState } from "react";
import "./navbar.css";
import { userSignOut } from "../../authenticationFunctions/signout";

function NavbarAuthenticated({ username }) {
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
                <a href="/user" className="to-home-button-navbar">Xanton</a>
            </div>
            <div className="buttons-authenticated-container">
                <button onClick={toggleDropdown} className="profile-button">
                    <span className="material-symbols-outlined" id="account-circle-image-google-fonts">account_circle</span>
                </button>
                {isDropdownVisible && (
                    <div className="dropdown-menu">
                        <h3>Welcome {username}</h3>
                        <button onClick={onSignOutClick} className="dropdown-item">Sign Out <div><span class="material-symbols-outlined">logout</span></div></button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavbarAuthenticated;
