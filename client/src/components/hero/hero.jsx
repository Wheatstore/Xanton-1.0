import "./hero.css" //import the hero css
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"

function HeroSection(){
    const location = useLocation()

    return (
        <>
            <div className="hero-section-container">
                {location.pathname === "/user" && <h1 className="welcome-heading-hero-section">Welcome! 😊</h1>}
                <h1 className="hero-heading">
                    <span className="heading--highlight">Interact with people </span>from the past for free.
                </h1>
            </div>
            <div className="hero-description-container">
                <h3>Step into the past and converse with the most influential figures in human history. With just your typing, unlock the wisdom, insights, and stories of legendary leaders, thinkers, and pioneers.</h3>
            </div>
            {location.pathname === "/" && <div className="join-now-button-container">
                <button onSubmit={() => useNavigate("/signup")} className="join-now-hero-section-button">Get Started</button>
            </div>}
        </>
    )
}

export default HeroSection