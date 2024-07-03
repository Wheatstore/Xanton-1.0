import "./signupForm.css";
import { useState } from "react";
import { signUpEmailPassword } from "../authenticationFunctions/signup";
import { signupLoginGoogle } from "../authenticationFunctions/signup";
import { useNavigate, useLocation } from "react-router-dom";

function Signup() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")

    const emailChange = (e) => {
        setEmail(e.target.value);
    };

    const passwordChange = (e) => {
        setPassword(e.target.value);
    };

    const onFormSignupEmail = async (e) => {
        e.preventDefault()
        try {
            console.log("New user creation initiated")
            await signUpEmailPassword(email, password)
            navigate("/")
        } catch(error) {
            console.error(error)
            switch (error.code) {
                case 'auth/weak-password':
                    setError('The password is too weak or short.');
                    break;
                case 'auth/email-already-in-use':
                    setError('This email is already taken.');
                    break;
                case 'auth/invalid-email':
                    setError('The email address is not valid.');
                    break;
                default:
                    setError(error.message);
            }
        }
    }

    const googleSignIn = async () => {
        try { 
            await signupLoginGoogle()
            navigate("/user")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="signup-page-container">
            <div className="signup-form-container">
                <form onSubmit={onFormSignupEmail}>
                    <h2 className="signup-form-heading">Sign Up</h2>
                    <p className="signup-form-description">Join to talk to the most important people in history</p>
                    <div className="email-input-container">
                        <input placeholder="Email" value={email} onChange={emailChange} type="text" className="email-input" />
                    </div>
                    <div className="password-input-container">
                        <input placeholder="Password" value={password} onChange={passwordChange} type="password" className="password-input" />
                        <button type="button" className="show-password-button">show</button>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="signup-button-container">
                        <button className="signup-button" type="submit">Sign Up</button>
                    </div>
                    <div className="login-page-link-sign-up-page-container">
                        <p>Already a member? Go to <a href="/login">Login</a></p>
                    </div>
                    <div className="divider">
                        <hr className="divider-line" />
                        <span className="divider-text">or</span>
                        <hr className="divider-line" />
                    </div>
                    <div className="alternative-signup-button-container">
                        <button onClick={googleSignIn} className="alternative-signup-button">Sign up with Google</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;