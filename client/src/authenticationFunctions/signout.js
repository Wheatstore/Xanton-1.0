import { auth } from "../firebase";
import { signOut } from "firebase/auth"

const userSignOut = () => {
    try {
        signOut(auth)
    } catch (error) {
        console.error(error.code, error.message)
        throw (error)
    }
}

export {userSignOut}