import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
          <p className="text-on-surface-variant">Create Your Premium Account</p>
        </header>

        {/* Form */}
        <form className="flex flex-col gap-stack-md" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-stack-sm">
            <label className="text-label-md text-on-surface-variant px-1" htmlFor="name">Full Name</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">person</span>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container/50 border border-outline-variant rounded-lg py-3 pl-12 pr-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline/50"
                placeholder="John Doe"
              />
            </div>
          </div>

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
                placeholder="Minimum 6 characters"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary h-12 rounded-lg font-semibold hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mt-stack-sm disabled:opacity-60"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                Create Account
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <footer className="text-center">
          <p className="text-body-sm text-on-surface-variant">
            Already have an account?
            <Link to="/login" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-1">Sign in</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Register;
