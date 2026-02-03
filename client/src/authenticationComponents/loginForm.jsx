import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginEmailPassword from "../authenticationFunctions/login";
import GoogleAuthButton from "./googleButton";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const emailChange = (e) => {
        setEmail(e.target.value);
        if (error) setError("");
    };

    const passwordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError("");
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await loginEmailPassword(email, password);
            navigate("/user");
        } catch (error) {
            switch (error.code) {
                case 'auth/invalid-credential':
                    setError('Email or password is incorrect');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many failed attempts. Please try again later');
                    break;
                default:
                    setError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center pt-10 justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400 text-lg">Continue your conversations with history</p>
                </div>

                {/* Main card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl shadow-2xl p-8">
                    <form onSubmit={onFormSubmit} className="space-y-6">
                        {/* Email input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input 
                                    id="email"
                                    type="email" 
                                    placeholder="you@example.com" 
                                    value={email} 
                                    onChange={emailChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 outline-none"
                                    required
                                />
                            </div>
                        </div>
                        
                        {/* Password input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input 
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password" 
                                    value={password} 
                                    onChange={passwordChange}
                                    className="w-full pl-12 pr-20 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 outline-none"
                                    required
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors px-2 py-1"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        
                        {/* Error message */}
                        {error && (
                            <div className="flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}
                        
                        {/* Forgot password */}
                        <div className="flex items-center justify-end">
                            <a href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                Forgot password?
                            </a>
                        </div>
                        
                        {/* Login button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="relative w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                "Log In"
                            )}
                        </button>
                        
                        {/* Divider */}
                        <div className="relative flex items-center justify-center py-4">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                            <span className="absolute bg-slate-900 px-4 text-slate-500 text-sm font-medium">or continue with</span>
                        </div>
                        
                        {/* Google sign in */}
                        <GoogleAuthButton />
                        
                        {/* Sign up link */}
                        <div className="text-center pt-4 border-t border-slate-800/50">
                            <p className="text-slate-400 text-sm">
                                New to Echoes of History?{" "}
                                <a href="/signup" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                                    Create an account
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Instant Access</p>
                    </div>
                    <div className="space-y-1">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Secure</p>
                    </div>
                    <div className="space-y-1">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Free Forever</p>
                    </div>
                </div>

                {/* Footer text */}
                <p className="text-center text-slate-500 text-sm mt-8">
                    By logging in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}

export default Login;