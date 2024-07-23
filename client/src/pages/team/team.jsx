import NavbarSpec from "../../components/navbar/navbarSpec"
import "./team.css"

function Team(){
    return (
        <>
        <div className="team-page-container-container">
            <NavbarSpec />
            <div className="team-page-container">
                <h1>This website was made by Nate Yoo. If you want to join the team, submit the feedback form.</h1>
            </div>
        </div>
        </>
    )
}

export default Team