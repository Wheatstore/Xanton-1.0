import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { postAuthenticated } from "./api";
import { generateUsername } from "unique-username-generator";

const saveUser = user => postAuthenticated('/api/create/user', {
  uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL,
});

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
    await saveUser(user)
  } catch (error) {
    console.error("There was an error creating a new user: ", error.code, error.message);
    throw error
  }
}

// Function to sign in with Google
const signupLoginGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // Additional user logic here if needed
    await saveUser(user)
  } catch (error) {
    console.error("There was an error signing in with Google: ", error.code, error.message);
    throw (error)
  }
}

//There are two functions because they both serve different purposes the first is only for when users signup while the second is for when users login

const loginGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("There was an error signing in with Google: ", error.code, error.message);
    throw (error)
  }
}

export { signUpEmailPassword, signupLoginGoogle, loginGoogle };
