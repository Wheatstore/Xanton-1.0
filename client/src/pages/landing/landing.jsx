import HeroSection from "../../components/hero/hero";
import NavbarHome from "../../components/navbar/navbar";
import Product from "../../components/product/product";
import "./landing.css"
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function LandingPage(){
    const [user, loading] = useAuthState(auth)

    if(loading){
        return (
            <>
                
            </>
        )
    }

    return (
        <>
            <div className="landing-page-container">
                <NavbarHome/>
                <HeroSection/>
                <Product/>
            </div>
        </>
    )
}

export default LandingPage