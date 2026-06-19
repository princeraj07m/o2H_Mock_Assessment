import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheckSquare, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { IS_MOCK } from '../services/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.warning('Please fill in all fields');
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (err) {
      toast.error(err || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login('john@example.com', 'password');
      toast.success('Logged in with Demo Account!');
      navigate('/');
    } catch (err) {
      toast.error(err || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 dark-gradient-bg relative px-4 py-12 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-violet-500/20 mb-3">
            <FiCheckSquare size={26} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Taskly.io
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Manage your workspaces and deliver on schedule.
          </p>
          {!IS_MOCK && (
            <p className="text-emerald-400/90 text-xs mt-2 font-medium">
              Connected to live API
            </p>
          )}
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative bg-slate-950/20">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            Sign In
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-350 mb-2 pl-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full glass-input pl-11 pr-4 py-3 rounded-2xl bg-slate-950/50 border-white/5 focus:border-violet-500 text-white focus:ring-violet-500/20 placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-355 mb-2 pl-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input pl-11 pr-11 py-3 rounded-2xl bg-slate-950/50 border-white/5 focus:border-violet-500 text-white focus:ring-violet-500/20 placeholder:text-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-200 outline-none"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-2xl font-semibold shadow-lg shadow-violet-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all outline-none"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-xs font-medium uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* Quick Demo Login */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all outline-none"
          >
            <FiUser size={16} />
            <span>{IS_MOCK ? 'Use Demo Account' : 'Use Demo Account (john@example.com)'}</span>
          </button>

          {/* Navigation link */}
          <p className="text-sm text-slate-400 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-all">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
