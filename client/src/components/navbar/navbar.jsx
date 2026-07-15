import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, FileText, HelpCircle, LogOut, Menu, User, X } from "lucide-react";
import { auth } from "../../firebase";
import { userSignOut } from "../../authenticationFunctions/signout";

const publicLinks = [
  { label: "Features", path: "/features" },
  { label: "About", path: "/about" },
  { label: "Our Figures", path: "/bots" },
  { label: "Partners", path: "/partners" },
  { label: "Articles", path: "/articles" },
];

function Brand() {
  return (
    <span className="flex items-center gap-3">
      <img src="/images/logoTransparent.png" alt="" className="h-10 w-auto object-contain brightness-0" />
      <span>
        <span className="block font-serif text-lg font-semibold leading-none tracking-wide text-stone-950">Echoes</span>
        <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.24em] text-stone-500">of history</span>
      </span>
    </span>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, loading] = useAuthState(auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigateTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await userSignOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const linkClasses = (path) =>
    `relative px-1 py-2 text-xs font-semibold transition after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:bg-stone-950 after:transition-transform ${
      location.pathname === path
        ? "text-stone-950 after:scale-x-100"
        : "text-stone-500 hover:text-stone-950 after:scale-x-0 hover:after:scale-x-100"
    }`;

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
                  href="/partners" 
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
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-64 overflow-hidden rounded-[24px] border border-stone-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,240,232,0.98))] p-2 shadow-[0_30px_80px_rgba(28,25,23,0.14)] backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
                    <div className="mb-2 rounded-[20px] border border-stone-200/80 bg-white/80 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Archive Member</p>
                      <p className="mt-1 font-serif text-base text-stone-950">{user.displayName || "Account"}</p>
                    </div>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => navigateTo(`/profile/${user.displayName}`)}
                        className="group flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition hover:bg-white"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-[#f7f2e8] text-stone-700 transition group-hover:border-stone-300 group-hover:bg-[#f1e8d8]">
                          <User className="h-4 w-4" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-semibold text-stone-900">Profile</span>
                          <span className="block text-[11px] text-stone-500">Visit your reading room</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="group flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition hover:bg-[#f7ede8]"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 transition group-hover:border-[#d8b8a4] group-hover:bg-[#fbf1ea]">
                          <LogOut className="h-4 w-4" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-semibold text-stone-900">Sign out</span>
                          <span className="block text-[11px] text-stone-500">Leave the archive for now</span>
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 lg:hidden" aria-label="Toggle navigation">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-stone-200 bg-[#f4f0e8] px-4 pb-5 pt-3 shadow-lg lg:hidden">
          <div className="space-y-1">
            {!user && !loading ? (
              <>
                {publicLinks.map((link, index) => (
                  <button type="button" key={link.path} onClick={() => navigateTo(link.path)} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium text-stone-700 hover:bg-white">
                    <span>{link.label}</span><span className="text-[10px] text-stone-400">0{index + 1}</span>
                  </button>
                ))}
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-stone-300 pt-4">
                  <button type="button" onClick={() => navigateTo("/login")} className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800">Log in</button>
                  <button type="button" onClick={() => navigateTo("/signup")} className="rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white">Sign up</button>
                </div>
              </>
            ) : user ? (
              <>
                <button type="button" onClick={() => navigateTo("/feedback")} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-white"><HelpCircle className="h-4 w-4" /> Feedback</button>
                <button type="button" onClick={() => navigateTo("/create-new-bot")} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-white"><FileText className="h-4 w-4" /> Request a figure</button>
                <button type="button" onClick={() => navigateTo(`/profile/${user.displayName}`)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-white"><User className="h-4 w-4" /> Profile</button>
                <button type="button" onClick={handleSignOut} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white"><LogOut className="h-4 w-4" /> Sign out</button>
              </>
            ) : null}
          </div>
        </div>
      )}

      <style>{`
        .archive-navbar { font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
        .archive-navbar .font-serif { font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif; }
      `}</style>
    </nav>
  );
}

export default Navbar;
