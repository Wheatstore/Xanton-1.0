import NavbarAuthenticated from "../../components/navbar/navbarAuthenticated"
import "./submitted.css"
import { useNavigate } from "react-router-dom"

function Submitted(){
    const navigate = useNavigate()
    return (
        <>
            <NavbarAuthenticated />
            <h1>Thank you for submitting</h1>
            <h3>Your submission is now under review and will be added in 1-3 days if eligable</h3>
            <button className="button-submitted-form" onClick={() => navigate("/user")}>Home</button>
        </>
    )
}

export default Submitted