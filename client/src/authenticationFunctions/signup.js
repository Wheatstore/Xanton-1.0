import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios"
import { generateFromEmail, generateUsername } from "unique-username-generator";

// Function to sign up with email and password
const signUpEmailPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const username = generateUsername()

    if (!user.photoURL){
      await updateProfile(user, {photoURL: "/images/Default_pfp.svg.png"})
    }
    await updateProfile(user, {displayName: username})
    // Additional user logic here if needed
    axios.post("http://localhost:3000/create/user", user)
  } catch (error) {
    console.error("There was an error creating a new user: ", error.code, error.message);
    throw error
  }
}

// Function to sign in with Google
const signupLoginGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);;
    const user = result.user;
    // Additional user logic here if needed
    axios.post("http://localhost:3000/create/user", user)
  } catch (error) {
    console.error("There was an error signing in with Google: ", error.code, error.message);
    throw (error)
  }
}

const loginGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);;
    const user = result.user;
  } catch (error) {
    console.error("There was an error signing in with Google: ", error.code, error.message);
    throw (error)
  }
}

export { signUpEmailPassword, signupLoginGoogle, loginGoogle };
