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
    <nav className="archive-navbar sticky top-0 z-50 w-full border-b border-stone-200 bg-[#fbfaf7]/95 text-stone-800 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => navigateTo("/")} aria-label="Echoes of History home">
          <Brand />
        </button>

        <div className="ml-auto hidden items-center gap-7 lg:flex">
          {!user && !loading ? (
            <>
              <div className="flex items-center gap-6 border-r border-stone-200 pr-7">
                {publicLinks.map((link) => (
                  <button type="button" key={link.path} onClick={() => navigateTo(link.path)} className={linkClasses(link.path)}>
                    {link.label}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => navigateTo("/login")} className="rounded-full px-3 py-2 text-xs font-semibold text-stone-700 transition hover:text-black">
                Log in
              </button>
              <button type="button" onClick={() => navigateTo("/signup")} className="rounded-full bg-stone-950 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black">
                Enter the archive
              </button>
            </>
          ) : user ? (
            <>
              <button type="button" onClick={() => navigateTo("/feedback")} className="flex items-center gap-2 text-xs font-semibold text-stone-500 transition hover:text-stone-950">
                <HelpCircle className="h-4 w-4" /> Feedback
              </button>
              <button type="button" onClick={() => navigateTo("/create-new-bot")} className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 transition hover:border-stone-900">
                <FileText className="h-4 w-4" /> Request a figure
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-full border border-stone-800 bg-stone-950 py-1.5 pl-1.5 pr-3 text-xs font-semibold text-white shadow-[0_16px_40px_rgba(28,25,23,0.18)] transition hover:-translate-y-0.5 hover:bg-black"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="h-7 w-7 rounded-full border border-white/20 object-cover grayscale" />
                  ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-stone-700"><User className="h-4 w-4" /></span>
                  )}
                  {user.displayName || "Account"}
                  <ChevronDown className={`h-3.5 w-3.5 transition ${profileDropdownOpen ? "rotate-180" : ""}`} />
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
