import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpEmailPassword } from "../authenticationFunctions/signup";
import GoogleAuthButton from "./googleButton";
import AuthLayout from "./AuthLayout";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFormSignupEmail = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signUpEmailPassword(email, password);
      navigate("/user");
    } catch (authError) {
      switch (authError.code) {
        case "auth/weak-password":
          setError("Password must be at least 6 characters long");
          break;
        case "auth/email-already-in-use":
          setError("This email is already registered. Try logging in instead");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address");
          break;
        default:
          setError(authError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthLayout signup>
    <div className="auth-content"><p className="mp-index">JOIN ECHOES OF HISTORY</p><h2>Your next chapter starts here.</h2><p className="auth-intro">Create an account to begin your first conversation.</p>
      <form className="auth-form" onSubmit={onFormSignupEmail}>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={event => { setEmail(event.target.value); setError(""); }} required/>
        <label htmlFor="password">Create a password</label>
        <div className="auth-password"><input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength="6" placeholder="At least 6 characters" value={password} onChange={event => { setPassword(event.target.value); setError(""); }} required/><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div>
        <p className="auth-help">Use at least six characters.</p>
        {error && <p role="alert" className="auth-error">{error}</p>}
        {!auth && <p role="status" className="auth-help">Account access is currently unavailable. Please try again when the connection is restored.</p>}
        <button className="mp-button auth-submit" type="submit" disabled={isLoading || !auth}>{isLoading ? "Creating account…" : "Create an account"}<span aria-hidden="true">→</span></button>
        <div className="auth-divider"><span>or</span></div>
        <GoogleAuthButton text="Sign up with Google"/>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      <p className="auth-terms">By signing up, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
    </div>
  </AuthLayout>;
}
export default Signup;
