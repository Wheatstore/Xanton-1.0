import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

/**
 * GoogleAuthButton - A reusable component for both signup and login with Google
 * @param {Object} props - Component props
 * @param {string} props.text - Button text (defaults to "Continue with Google")
 * @param {Function} props.onSuccess - Optional callback for successful authentication
 * @param {Function} props.onError - Optional callback for authentication errors
 */
const GoogleAuthButton = ({ text = "Continue with Google", onSuccess, onError }) => {
  const navigate = useNavigate();
  
  const handleGoogleAuth = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    
    // Add scopes if needed
    // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    
    try {
      const result = await signInWithPopup(auth, provider);
      
      // This gives you a Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      
      // The signed-in user info
      const user = result.user;
      
      // Handle success
      if (onSuccess) {
        onSuccess(user);
      } else {
        // Default navigation behavior
        navigate("/user");
      }
      
    } catch (error) {
      // Handle Errors
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used
      const email = error.customData?.email;
      // The AuthCredential type that was used
      const credential = GoogleAuthProvider.credentialFromError(error);
      
      console.error("Google Auth Error:", { errorCode, errorMessage, email });
      
      if (onError) {
        onError(error);
      } else {
        // Default error handling
        console.error(error);
      }
    }
  };

  return (
    <button
      onClick={handleGoogleAuth}
      className="flex items-center justify-center w-full py-3 px-4 bg-white hover:bg-gray-100 rounded-lg text-gray-800 font-medium transition-all duration-200 border border-gray-300 shadow-sm"
      type="button"
    >
      <svg 
        className="w-5 h-5 mr-3" 
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      {text}
    </button>
  );
};

export default GoogleAuthButton;