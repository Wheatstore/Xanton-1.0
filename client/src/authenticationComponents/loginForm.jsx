import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginEmailPassword from "../authenticationFunctions/login";
import GoogleAuthButton from "./googleButton";

function LogoMark() {
  return <img src="/images/logoTransparent.png" alt="Echoes of History" className="h-full w-full object-contain brightness-0" />;
}

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

  return (
    <div className="auth-archive grid min-h-[calc(100dvh-72px)] bg-[#f5f2ec] lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative hidden overflow-hidden border-r border-stone-200 bg-[#e9e2d7] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -bottom-20 -right-20 h-80 w-80 opacity-[0.055]"><LogoMark /></div>
        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-500">Members’ reading room</p>
          <div className="mt-8 h-px w-20 bg-stone-900" />
        </div>
        <div className="relative max-w-xl">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-stone-500">Return to the archive</p>
          <h1 className="font-serif text-5xl font-medium leading-[1.06] tracking-tight text-stone-950 xl:text-6xl">Continue a conversation that history left unfinished.</h1>
          <p className="mt-7 max-w-md text-sm leading-7 text-stone-600">Your saved figures, past conversations, and historical discoveries are waiting where you left them.</p>
        </div>
        <div className="relative flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
          <span>Private archive</span><span className="h-1 w-1 rounded-full bg-stone-500" /><span>Secure access</span><span className="h-1 w-1 rounded-full bg-stone-500" /><span>Always available</span>
        </div>
      </aside>

      <main className="relative flex items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
        <div className="pointer-events-none absolute left-10 top-10 h-36 w-36 rounded-full border border-stone-200 opacity-70" />
        <div className="pointer-events-none absolute left-[5.5rem] top-[5.5rem] h-20 w-20 rounded-full border border-stone-200 opacity-60" />

        <div className="relative w-full max-w-[470px]">
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <span className="h-10 w-10 rounded-full border border-stone-300 bg-white p-2"><LogoMark /></span>
            <span className="font-serif text-xl font-semibold text-stone-950">Echoes of History</span>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500">Account access · 01</p>
            <h2 className="font-serif text-4xl font-medium tracking-tight text-stone-950 sm:text-5xl">Welcome back</h2>
            <p className="mt-3 text-sm text-stone-500">Sign in to continue your conversations with history.</p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-white p-6 shadow-[0_24px_70px_rgba(70,55,40,0.1)] sm:p-8">
            <form onSubmit={onFormSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.17em] text-stone-500">Email address</label>
                <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} className="w-full rounded-xl border border-stone-200 bg-[#faf8f4] px-4 py-3.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:bg-white focus:ring-4 focus:ring-stone-900/5" required />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.17em] text-stone-500">Password</label>
                  <a href="#" className="text-[11px] font-semibold text-stone-500 hover:text-stone-950">Forgot password?</a>
                </div>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} className="w-full rounded-xl border border-stone-200 bg-[#faf8f4] px-4 py-3.5 pr-16 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:bg-white focus:ring-4 focus:ring-stone-900/5" required />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-wide text-stone-500 hover:text-stone-950">{showPassword ? "Hide" : "Show"}</button>
                </div>
              </div>

              {error && <div role="alert" className="rounded-xl border border-stone-300 bg-stone-100 px-4 py-3 text-sm text-stone-700">{error}</div>}

              <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center rounded-xl bg-stone-950 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-stone-300">
                {isLoading ? <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Opening archive...</> : "Enter the archive"}
              </button>

              <div className="flex items-center gap-3 py-1"><span className="h-px flex-1 bg-stone-200" /><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">or</span><span className="h-px flex-1 bg-stone-200" /></div>
              <GoogleAuthButton />

              <p className="border-t border-stone-100 pt-5 text-center text-xs text-stone-500">New to the archive? <a href="/signup" className="font-bold text-stone-950 underline decoration-stone-300 underline-offset-4">Create an account</a></p>
            </form>
          </div>

          <p className="mt-5 text-center text-[10px] leading-5 text-stone-400">By logging in, you agree to our <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>.</p>
        </div>
      </main>

      <style>{`
        .auth-archive { font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
        .auth-archive .font-serif { font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif; }
      `}</style>
    </div>
  );
}

export default Login;
