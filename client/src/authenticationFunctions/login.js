import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const loginEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Additional user logic here if needed
  } catch (error) {
    throw (error)
  }
};

export default loginEmailPassword

