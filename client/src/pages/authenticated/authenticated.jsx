import HeroSection from "../../components/hero/hero";
import NavbarAuthenticated from "../../components/navbar/navbarAuthenticated";
import Product from "../../components/product/product";
import "./authenticated.css"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

function AuthenticatedPage (){
    const [user, loading] = useAuthState(auth)

    const username = user.displayName

    if(loading){
        return (
            <>
            
            </>
        )
    }

    return (
        <>
            <div className="authenticated-page">
                <NavbarAuthenticated username={username} />
                <HeroSection />
                <Product />
            </div>
        </>
    )
}

export default AuthenticatedPage