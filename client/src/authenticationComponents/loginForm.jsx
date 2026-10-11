import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginEmailPassword from "../authenticationFunctions/login";
import GoogleAuthButton from "./googleButton";
import AuthLayout from "./AuthLayout";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loginEmailPassword(email, password);
      navigate("/user");
    } catch (authError) {
      switch (authError.code) {
        case "auth/invalid-credential":
          setError("Email or password is incorrect");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later");
          break;
        default:
          setError(authError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthLayout>
    <div className="auth-content"><p className="mp-index">YOUR ACCOUNT</p><h2>Welcome back.</h2><p className="auth-intro">Log in to continue your conversations with history.</p>
      <form className="auth-form" onSubmit={onFormSubmit}>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={event => { setEmail(event.target.value); setError(""); }} required/>
        <label htmlFor="password">Password</label>
        <div className="auth-password"><input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password"  placeholder="Enter your password" value={password} onChange={event => { setPassword(event.target.value); setError(""); }} required/><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div>

        {error && <p role="alert" className="auth-error">{error}</p>}
        {!auth && <p role="status" className="auth-help">Account access is currently unavailable. Please try again when the connection is restored.</p>}
        <button className="mp-button auth-submit" type="submit" disabled={isLoading || !auth}>{isLoading ? "Logging in…" : "Log in"}<span aria-hidden="true">→</span></button>
        <div className="auth-divider"><span>or</span></div>
        <GoogleAuthButton/>
      </form>
      <p className="auth-switch">New to Echoes? <Link to="/signup">Create an account</Link></p>
      <p className="auth-terms">By logging in, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
    </div>
  </AuthLayout>;
}
export default Login;
