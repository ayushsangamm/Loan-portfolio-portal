import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, ShieldAlert, Sparkles, FolderLock } from "lucide-react";

export const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form submission handler
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate short network delay for premium feel
    setTimeout(() => {
      if (username.trim().toLowerCase() === "admin" && password === "admin123") {
        const mockSession = {
          name: "Ayush Admin",
          role: "Portfolio Officer",
          email: "admin@lending.com",
          loginTime: new Date().toISOString()
        };
        localStorage.setItem("user_session", JSON.stringify(mockSession));
        setIsLoading(false);
        navigate("/", { replace: true });
      } else {
        setIsLoading(false);
        setError("Invalid username or password. Please try again.");
      }
    }, 800);
  };

  // Quick fill helper for demo login
  const handleQuickFill = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 p-4 relative overflow-hidden font-sans">
      {/* Decorative premium radial ambient background highlights */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Core Header Identity Logo */}
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 shadow-lg shadow-brand-500/20 ring-1 ring-white/10">
            <FolderLock className="h-6.5 w-6.5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">Antigravity Portal</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1.5 uppercase tracking-widest">Enterprise Loan Systems</p>
          </div>
        </div>

        {/* Glassmorphic Login Form Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
          
          <div className="mb-6">
            <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
              <Sparkles className="h-4.5 w-4.5 text-amber-400" />
              <span>Officer Authentication</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-normal">Enter credentials to unlock administrative credit worksheets.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error alerts with smooth transition */}
            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 flex items-start gap-2.5 text-rose-200 text-xs animate-pulse">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-400 shrink-0 mt-0.5" />
                <p className="font-semibold leading-normal">{error}</p>
              </div>
            )}

            {/* Input 1: Username */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                  <User className="h-4 w-4" />
                </span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter administrator username" 
                  required
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 smooth-transition"
                />
              </div>
            </div>

            {/* Input 2: Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Code / Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security password" 
                  required
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 smooth-transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white smooth-transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-extrabold text-xs shadow-lg shadow-brand-500/10 cursor-pointer smooth-transition active:scale-98 ${
                isLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Validating Credit Dossier..." : "Secure Sign In"}
            </button>
          </form>

          {/* Quick Fill Demo Hint */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-400 font-semibold leading-normal">
              Recruiter Testing / Demo Mode?
            </p>
            <button
              onClick={handleQuickFill}
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-brand-400 hover:text-brand-300 smooth-transition cursor-pointer border-b border-dashed border-brand-400/40"
            >
              <span>Auto-fill Demo Credentials</span>
            </button>
            <div className="flex justify-center gap-4 text-[9px] text-slate-500 font-medium mt-2.5 bg-slate-950/30 py-1.5 rounded-lg border border-white/5">
              <span>User: <strong className="text-slate-300">admin</strong></span>
              <span>Pass: <strong className="text-slate-300">admin123</strong></span>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-slate-500 leading-normal">
          Authorized banking access only. Activity is monitored under standard compliance security guidelines.
        </p>

      </div>
    </div>
  );
};

export default Login;
