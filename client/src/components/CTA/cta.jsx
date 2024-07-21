import { useState } from "react"
import "./cta.css"
import { useNavigate } from "react-router-dom"

function Cta(){
    const navigate = useNavigate()
    const [emailInputNews, setEmailInputNews] = useState("")

    return (
        <>
            <div className="cta-container-signup">
                <h1>Sign up today.</h1>
                <h3>Don't wait any longer. Sign up to explore history now</h3>
                <div className="button-container-cta">
                    <button className="cta-getstarted" onClick={() => navigate("/signup")}>Get started</button>
                    <button className="cta-learnmore">Learn more</button>
                </div>
            </div>
            <div className="cta-contact-info-container">
                <div className="cta-newsletter-signup">
                    <h1>Learn more about Xanton</h1>
                    <h3>Sign up for this newsletter updating you about my progress as a 15 year old programmer. Or just sign up to read for fun. You don't want to miss it</h3>
                    <div className="input-form-newsletter-container">
                        <input type="email" placeholder="Email" onChange={(e) => setEmailInputNews(e.target.value) } value={emailInputNews}/>
                        <button>Get notified</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cta