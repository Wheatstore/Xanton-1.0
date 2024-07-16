import "./loginForm.css"
import { useState } from "react"
import loginEmailPassword from "../authenticationFunctions/login"
import { useNavigate } from "react-router-dom"
import GoogleSignInButton from "../components/buttons/googleSignin"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowpassword] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const emailChange = (e) => {
        setEmail(e.target.value)
    }

    const passwordChange = (e) => {
        setPassword(e.target.value)
    }

    const onFormSubmit = async (e) => {
        e.preventDefault()
        try {
            await loginEmailPassword(email, password)
            navigate("/user")
        } catch (error) {
            switch (error.code) {
                case 'auth/invalid-credential':
                    setError('Sorry :( Email or password is invalid');
                    break;
                case 'auth/too-many-requests':
                    setError('Sorry :( You tried too many times. Try again later')
                    break
                default:
                    setError(error.message);
            }
        }
    }


    return (
        <div className="login-page-container">
            <div className="login-form-container">
                <form onSubmit={onFormSubmit}>
                    <h2 className="login-form-heading">Login</h2>
                    <p className="login-form-description">Talk to the most important people in history</p>
                    <div className="email-input-container">
                        <input placeholder="Email" value={email} onChange={emailChange} type="email" className="email-input"/>
                    </div>
                    <div className="password-input-container">
                        <input placeholder="Password" value={password} onChange={passwordChange} type={showPassword ? "text" : "password" } className="password-input" />
                        <button type="button" className="show-password-button" onClick={() => setShowpassword(prev => (!prev))}>show</button>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="forgot-password-container">
                        <a href="#" className="forgot-password-link">Forgot password?</a>
                    </div>
                    <div className="login-button-container">
                        <button type="submit" className="login-button">Login</button>
                    </div>
                    <div className="login-page-link-sign-up-page-container">
                        <p>Not apart of Xanton <a href="/signup">Join</a> now</p>
                    </div>
                    <div className="divider">
                        <hr className="divider-line"/>
                        <span className="divider-text">or</span>
                        <hr className="divider-line"/>
                    </div>
                </form>
                <div className="alternative-login-button-container">
                    <GoogleSignInButton />
                </div>
            </div>
        </div>
    )
}

export default Login
