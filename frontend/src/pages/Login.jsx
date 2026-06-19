import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-card-entrance">
      <div className="bg-surface/60 backdrop-blur-xl rounded-xl border border-outline-variant/30 p-glass-padding glass-glow inner-stroke flex flex-col gap-stack-lg shadow-2xl">
        {/* Logo */}
        <header className="flex flex-col items-center text-center gap-stack-sm">
          <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center shadow-lg shadow-primary-container/20 mb-stack-sm">
            <span className="material-symbols-outlined text-on-primary-container text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
          </div>
          <h1 className="text-headline-lg text-on-surface tracking-tight">CloudVault</h1>
          <p className="text-on-surface-variant">Premium Storage for Enterprise Teams</p>
        </header>

        {/* Form */}
        <form className="flex flex-col gap-stack-md" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-stack-sm">
            <label className="text-label-md text-on-surface-variant px-1" htmlFor="email">Email Address</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container/50 border border-outline-variant rounded-lg py-3 pl-12 pr-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline/50"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-stack-sm">
            <label className="text-label-md text-on-surface-variant px-1" htmlFor="password">Password</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container/50 border border-outline-variant rounded-lg py-3 pl-12 pr-12 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline/50"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-unit">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary/20 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Remember Me</span>
            </label>
            <a className="text-body-sm text-primary hover:text-primary-container transition-colors" href="#">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary h-12 rounded-lg font-semibold hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mt-stack-sm disabled:opacity-60"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                Login
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-stack-md">
          <div className="h-[1px] flex-1 bg-outline-variant/30" />
          <span className="text-label-md text-outline">OR</span>
          <div className="h-[1px] flex-1 bg-outline-variant/30" />
        </div>

        {/* Social Login */}
        <button className="w-full bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface h-12 rounded-lg font-medium transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <footer className="text-center">
          <p className="text-body-sm text-on-surface-variant">
            New to CloudVault?
            <Link to="/register" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-1">Create an account</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
