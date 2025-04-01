
import Product from "../../components/product/product";
import "./authenticated.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import Footer from "../../components/landing/footer/footer";
import HeadingUser from "../../components/headingUser/headingUser";
import Navbar from "../../components/navbar/navbar";

function AuthenticatedPage (){
    const [user, loading] = useAuthState(auth)

    if(loading){
        return (
            <>
            
            </>
        )
    }

    return (
        <>
        
            <Navbar />
            <HeadingUser />
            <Product isLanding={false} />
            <Footer />
        </>
    )
}

export default AuthenticatedPage