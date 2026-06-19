import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheckSquare, FiImage, FiUploadCloud } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  const handleImageSelect = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === 'avatar') {
      setAvatarFile(file);
      setAvatarPreview(previewUrl);
    } else {
      setCoverFile(file);
      setCoverPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return toast.warning('Please fill in all fields');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await register(name, email, password, {
        avatar: avatarFile,
        coverImage: coverFile,
      });
      toast.success('Registration successful! Welcome to Taskly.');
      navigate('/');
    } catch (err) {
      toast.error(err || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 dark-gradient-bg relative px-4 py-12 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-violet-500/20 mb-3">
            <FiCheckSquare size={26} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Taskly.io
          </h2>
          <p className="text-slate-400 text-sm mt-1.5">
            Create an account to simplify your workflows.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative bg-slate-950/20">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            Create Account
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4.5">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-350 mb-1.5 pl-1">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full glass-input pl-11 pr-4 py-2.5 rounded-2xl bg-slate-950/50 border-white/5 focus:border-violet-500 text-white focus:ring-violet-500/20 placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-350 mb-1.5 pl-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full glass-input pl-11 pr-4 py-2.5 rounded-2xl bg-slate-950/50 border-white/5 focus:border-violet-500 text-white focus:ring-violet-500/20 placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-350 mb-1.5 pl-1 flex items-center gap-1">
                  <FiImage size={12} />
                  Avatar (optional)
                </label>
                <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 cursor-pointer hover:border-violet-500/40 transition-colors">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <FiUploadCloud className="text-slate-400" size={22} />
                  )}
                  <span className="text-[11px] text-slate-400 text-center">
                    {avatarFile ? avatarFile.name : 'Upload avatar'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageSelect(e, 'avatar')}
                  />
                </label>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-350 mb-1.5 pl-1 flex items-center gap-1">
                  <FiImage size={12} />
                  Cover (optional)
                </label>
                <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 cursor-pointer hover:border-violet-500/40 transition-colors">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover preview" className="h-16 w-full rounded-lg object-cover" />
                  ) : (
                    <FiUploadCloud className="text-slate-400" size={22} />
                  )}
                  <span className="text-[11px] text-slate-400 text-center">
                    {coverFile ? coverFile.name : 'Upload cover'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageSelect(e, 'cover')}
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-350 mb-1.5 pl-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input pl-11 pr-11 py-2.5 rounded-2xl bg-slate-950/50 border-white/5 focus:border-violet-500 text-white focus:ring-violet-500/20 placeholder:text-slate-500"
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

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-350 mb-1.5 pl-1">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input pl-11 pr-11 py-2.5 rounded-2xl bg-slate-950/50 border-white/5 focus:border-violet-500 text-white focus:ring-violet-500/20 placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-2xl font-semibold shadow-lg shadow-violet-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all mt-4 outline-none"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-sm text-slate-400 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-all">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
