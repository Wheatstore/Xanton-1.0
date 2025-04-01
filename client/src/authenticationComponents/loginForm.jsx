import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginEmailPassword from "../authenticationFunctions/login";
import GoogleAuthButton from "./googleButton";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const emailChange = (e) => {
        setEmail(e.target.value);
    };

    const passwordChange = (e) => {
        setPassword(e.target.value);
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginEmailPassword(email, password);
            navigate("/user");
        } catch (error) {
            switch (error.code) {
                case 'auth/invalid-credential':
                    setError('Sorry :( Email or password is invalid');
                    break;
                case 'auth/too-many-requests':
                    setError('Sorry :( You tried too many times. Try again later');
                    break;
                default:
                    setError(error.message);
            }
        }
    };

    return (
        <div className="flex justify-center items-center pt-50 min-w-screen bg-black bg-opacity-95">
            <div className="w-full max-w-md px-8 py-10 mx-4 bg-black border border-gray-800 rounded-2xl shadow-2xl backdrop-blur-sm">
                <form onSubmit={onFormSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Login</h2>
                        <p className="text-gray-300">Talk to the most important people in history</p>
                    </div>
                    
                    <div className="space-y-4">
                        {/* Email input */}
                        <div>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    value={email} 
                                    onChange={emailChange}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    required
                                />
                            </div>
                        </div>
                        
                        {/* Password input */}
                        <div>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password" 
                                    value={password} 
                                    onChange={passwordChange}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    required
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 font-semibold text-sm hover:text-blue-400 transition-colors"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Error message */}
                    {error && (
                        <div className="px-4 py-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-lg">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                    
                    {/* Forgot password */}
                    <div className="text-right">
                        <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
                            Forgot password?
                        </a>
                    </div>
                    
                    {/* Login button */}
                    <button 
                        type="submit" 
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all duration-200 transform hover:translate-y-[-2px] active:translate-y-[0px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
                    >
                        Login
                    </button>
                    
                    {/* Sign up link */}
                    <div className="text-center text-gray-300 text-sm">
                        Not a part of Xanton? <a href="/signup" className="text-blue-500 font-medium hover:text-blue-400 transition-colors">Join</a> now
                    </div>
                    
                    {/* Divider */}
                    <div className="relative flex items-center justify-center">
                        <div className="h-px w-full bg-gray-700"></div>
                        <span className="absolute bg-black px-4 text-gray-400 text-sm">or</span>
                    </div>
                </form>
                
                {/* Google sign in */}
                <div className="mt-6">
                    <GoogleAuthButton />
                </div>
            </div>
        </div>
    );
}

export default Login;