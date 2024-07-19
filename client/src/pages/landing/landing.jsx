import HeroSection from "../../components/hero/hero";
import NavbarHome from "../../components/navbar/navbar";
import Product from "../../components/product/product";
import "./landing.css"
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Footer from "../../components/footer/footer";
import Carousel from "../../components/carousel/carousel";
import Featured from "../../components/carousel/featured/featured";

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
                <Carousel />
                <Product/>
                <Footer />
            </div>
        </>
    )
}

export default LandingPage