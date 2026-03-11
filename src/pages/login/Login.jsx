import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Github, 
  Calendar, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import './Login.css';

// --- Assets & Icons ---

const EventifyLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 16C12 13.7909 13.7909 12 16 12H32C34.2091 12 36 13.7909 36 16V32C36 34.2091 34.2091 36 32 36H16C13.7909 36 12 34.2091 12 32V16Z" className="fill-indigo-500" fillOpacity="0.2"/>
    <path d="M16 12V8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M32 12V8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M12 20H36" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <rect x="12" y="12" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="4"/>
    <circle cx="28" cy="28" r="3" className="fill-indigo-400" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// --- Components ---

const InputField = ({ 
  label, 
  type, 
  placeholder, 
  icon: Icon, 
  value, 
  onChange, 
  error,
  isPassword = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-300 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
          <Icon size={18} />
        </div>
        <input
          type={inputType}
          className={`block w-full pl-10 pr-10 py-3 bg-slate-800/50 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-indigo-500'} rounded-xl text-white placeholder-slate-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs ml-1">{error}</p>}
    </div>
  );
};

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen w-full flex bg-[#0f172a] text-white overflow-hidden relative font-sans selection:bg-indigo-500/30">
    {/* Dynamic Background Elements */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
    </div>

    {/* Main Container */}
    <div className="w-full max-w-6xl mx-auto flex z-10 p-4 lg:p-8 items-center justify-center lg:justify-between">
      
      {/* Left Side - Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col justify-center max-w-lg space-y-8">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 backdrop-blur-sm">
            <EventifyLogo className="w-8 h-8 text-indigo-400" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Eventify</span>
        </div>
        
        <h1 className="text-5xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-200">
          The Future of <br/>
          Event Management.
        </h1>
        
        <p className="text-lg text-slate-400 leading-relaxed max-w-md">
          Join 10,000+ organizers and attendees using Eventify to create, discover, and experience unforgettable moments.
        </p>

        <div className="flex items-center space-x-4 pt-4">
          <div className="flex -space-x-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-slate-700 flex items-center justify-center text-xs overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center text-amber-400 space-x-1">
              {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
            </div>
            <span className="text-xs text-slate-500 font-medium">Trusted by top organizers</span>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Card */}
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  </div>
);

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Reset state on toggle
  useEffect(() => {
    setErrors({});
    setFormData({ name: '', email: '', password: '' });
  }, [isLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.type]: e.target.value });
    // Clear error for this field
    if (errors[e.target.type]) {
      setErrors({ ...errors, [e.target.type]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!isLogin && !formData.name) newErrors.text = 'Name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 chars';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    
    alert(isLogin ? "Welcome back to Eventify!" : "Account created successfully!");
  };

  return (
    <AuthLayout>
      <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden">
        {/* Decorative top sheen */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

        <div className="mb-8 text-center">
          <div className="lg:hidden flex justify-center mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <EventifyLogo className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Enter your details to access your dashboard.' : 'Start your journey with Eventify today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <InputField 
                label="Full Name"
                type="text"
                placeholder="John Doe"
                icon={CheckCircle}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                error={errors.text}
              />
            </div>
          )}

          <InputField 
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            error={errors.email}
          />

          <div>
            <InputField 
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              isPassword
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              error={errors.password}
            />
            {isLogin && (
              <div className="flex justify-end mt-2">
                <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          <button 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0f1829] text-slate-500 bg-opacity-90">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 transition-all text-white font-medium text-sm space-x-2 group">
              <GoogleIcon />
              <span className="text-slate-300 group-hover:text-white">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 transition-all text-white font-medium text-sm space-x-2 group">
              <Github className="w-5 h-5 text-white" />
              <span className="text-slate-300 group-hover:text-white">GitHub</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm">
          <span className="text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            {isLogin ? 'Sign up for free' : 'Log in'}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}