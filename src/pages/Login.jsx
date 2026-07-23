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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 font-sans text-slate-100">
      {/* Main Container */}
      <div className="w-full max-w-md space-y-6">
        
        {/* Core Header Identity Logo */}
        <div className="flex flex-col items-center text-center space-y-2 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
            <FolderLock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">CapitalFlow Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Enterprise Loan Portfolio Management</p>
          </div>
        </div>

        {/* Clean Login Form Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          
          <div className="mb-6">
            <h2 className="text-base font-semibold text-white">Sign in to your account</h2>
            <p className="text-xs text-slate-400 mt-1">Enter your administrative credentials below.</p>
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
              <label className="text-xs font-medium text-slate-300">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                  <User className="h-4 w-4" />
                </span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin" 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Input 2: Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow cursor-pointer transition-colors ${
                isLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Quick Fill Demo Hint */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              Click to Auto-fill Demo Credentials (admin / admin123)
            </button>
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
