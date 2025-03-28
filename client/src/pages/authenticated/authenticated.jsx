import NavbarAuthenticated from "../../components/navbar/navbarAuthenticated";
import Product from "../../components/product/product";
import "./authenticated.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import Footer from "../../components/landing/footer/footer";
import HeadingUser from "../../components/headingUser/headingUser";

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
                <HeadingUser />
                <Product isLanding={false} />
                <Footer />
            </div>
        </>
    )
}

export default AuthenticatedPage