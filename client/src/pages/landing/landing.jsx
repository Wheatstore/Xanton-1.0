import HeroSection from "../../components/hero/hero";
import NavbarHome from "../../components/navbar/navbar";
import Product from "../../components/product/product";
import "./landing.css"
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Footer from "../../components/footer/footer";
import Carousel from "../../components/carousel/carousel";
import ProductLanding from "../../components/product/productLanding";
import Cta from "../../components/CTA/cta";

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
                <ProductLanding />
                <Carousel />
                <Cta />
                <Footer />
            </div>
        </>
    )
}

export default LandingPage