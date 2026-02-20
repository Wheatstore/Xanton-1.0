import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { userSignOut } from "../../authenticationFunctions/signout";
import { Menu, X, User, HelpCircle, LogOut, FileText, Users, ChevronDown } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, loading] = useAuthState(auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
  
  const handleSignOut = async () => {
    try {
      await userSignOut();
      console.log("Signed up")
      setProfileDropdownOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
    finally{
        navigate("/");
    }
  };
  
  const navigateToProfile = () => {
    if (user) {
      navigate(`/profile/${user.displayName}`);
      setProfileDropdownOpen(false);
    }
  };
  
  // Helper function to close menus when navigating
  const navigateTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <nav className={`relative isolate w-full z-50 transition-all duration-300  ${
      scrolled ? "bg-[#0b0b0f]/80 backdrop-blur-md py-2" : "bg-transparent py-4"
    }`}>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px
                      bg-gradient-to-r via-purple-400/100 
                      blur-[0.1px]" />
      
      <div className="relative z-10 max-w-[60%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Echoes of History AI" 
                className="h-[60px] w-auto transition-all duration-300 hover:opacity-80" 
              />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Conditional navigation based on authentication */}
            {!user && !loading ? (
              <>
                <a 
                  href="/features" 
                  className="text-white hover:text-blue-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Features
                </a>
                <a 
                  href="/about" 
                  className="text-white hover:text-blue-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  About
                </a>
                <a href='/bots' className="text-white hover:text-blue-300 px-3 py-2 text-sm font-medium transition-colors duration-200">
                  Our Figures
                </a>
                 <a 
                  href="/partner" 
                  className="text-white hover:text-blue-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Partner
                </a>
                <a href='/articles' className="text-white hover:text-blue-300 px-3 py-2 text-sm font-medium transition-colors duration-200">
                  Articles
                </a>
                <button 
                  onClick={() => navigateTo("/login")} 
                  className="ml-2 px-5 py-2 bg-transparent border border-white/30 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-all duration-300"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigateTo("/signup")} 
                  className="px-5 py-2 bg-blue-600 rounded-full text-sm font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all duration-300"
                >
                  Get Started
                </button>
              </>
            ) : user ? (
              <>
                <button 
                  onClick={() => navigateTo("/feedback")} 
                  className="flex items-center text-white hover:text-blue-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  <HelpCircle className="w-4 h-4 mr-1" />
                  Feedback
                </button>
                <button 
                  onClick={() => navigateTo("/create-new-bot")} 
                  className="px-5 py-2 bg-blue-600 rounded-full text-sm font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all duration-300"
                >
                  Request a new bot
                </button>
                <div className="relative">
                  <button 
                    onClick={toggleProfileDropdown} 
                    className="flex items-center text-white hover:text-blue-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >

                    <User className="h-5 w-5 mr-2" />

                    <span>{user.displayName || 'Profile'}</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {/* Profile dropdown menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <button
                          onClick={navigateToProfile}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-300 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-black/95 backdrop-blur-md`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          
          {/* Conditional links based on authentication */}
          {!user && !loading ? (
            <>
              <a 
                href="/features" 
                className="block px-3 py-2 text-base font-medium text-white hover:text-blue-300 transition-colors duration-200"
              >
                Features
              </a>
              <a 
                href="/pricing" 
                className="block px-3 py-2 text-base font-medium text-white hover:text-blue-300 transition-colors duration-200"
              >
                Pricing
              </a>
            </>
          ) : user ? (
            <>
              <button 
                onClick={() => navigateTo("/feedback")} 
                className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-white hover:text-blue-300 transition-colors duration-200"
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                Feedback
              </button>
              <button 
                onClick={() => navigateTo("/create-new-bot")} 
                className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-white hover:text-blue-300 transition-colors duration-200"
              >
                <FileText className="h-5 w-5 mr-2" />
                Request a new bot
              </button>
              <button 
                onClick={navigateToProfile} 
                className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-white hover:text-blue-300 transition-colors duration-200"
              >
                <User className="h-5 w-5 mr-2" />
                Profile
              </button>
            </>
          ) : null}
        </div>
        
        {/* Mobile auth buttons or profile info */}
        <div className="pt-4 pb-3 border-t border-white/10">
          {!user && !loading ? (
            <div className="flex items-center justify-center space-x-3 px-4">
              <button 
                onClick={() => navigateTo("/login")} 
                className="w-full px-5 py-2 bg-transparent border border-white/30 rounded-full text-base font-medium text-white hover:bg-white/10 transition-all duration-300"
              >
                Login
              </button>
              <button 
                onClick={() => navigateTo("/signup")} 
                className="w-full px-5 py-2 bg-blue-600 rounded-full text-base font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          ) : user ? (
            <div className="px-4">
              <div className="flex items-center pb-3">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="h-10 w-10 rounded-full mr-3 border border-white/30"
                  />
                ) : (
                  <User className="h-10 w-10 p-1 rounded-full mr-3 bg-gray-700 text-white" />
                )}
                <div>
                  <div className="text-base font-medium text-white">{user.displayName || 'User'}</div>
                  <div className="text-sm font-medium text-gray-400 truncate max-w-[200px]">{user.email}</div>
                </div>
              </div>
              <button 
                onClick={handleSignOut} 
                className="mt-2 w-full flex items-center justify-center px-5 py-2 border border-white/20 rounded-md text-base font-medium text-white hover:bg-white/10 transition-all duration-300"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;