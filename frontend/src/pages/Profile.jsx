import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiSave, FiUser, FiInfo, FiKey, FiImage, FiTrendingUp, FiUploadCloud } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { stats } = useTasks();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [coverImage, setCoverImage] = useState(user?.coverImage || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setBio(user?.bio || '');
    setAvatar(user?.avatar || '');
    setCoverImage(user?.coverImage || '');
  }, [user]);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  ];

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
      setAvatar(previewUrl);
    } else {
      setCoverFile(file);
      setCoverImage(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.warning('Name cannot be empty');
    }

    if (password && password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setSaving(true);
    try {
      const updateData = { name, bio };
      if (password) updateData.password = password;
      if (!avatarFile && avatar) updateData.avatar = avatar;

      await updateProfile(updateData, {
        avatar: avatarFile,
        coverImage: coverFile,
      });

      toast.success('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
      setAvatarFile(null);
      setCoverFile(null);
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-5 sm:space-y-6 pb-24 sm:pb-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6 md:col-span-1">
          <div className="glass-panel rounded-3xl text-center border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden flex flex-col items-center">
            <div
              className="absolute top-0 inset-x-0 h-28 bg-cover bg-center"
              style={{
                backgroundImage: coverImage
                  ? `url(${coverImage})`
                  : 'linear-gradient(to top right, rgba(124,58,237,0.45), rgba(99,102,241,0.35))',
              }}
            />
            <div className="absolute top-0 inset-x-0 h-28 bg-slate-900/20" />

            <div className="relative mt-16 mb-4">
              <img
                src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.name}
                className="h-24 w-24 rounded-full border-4 border-white dark:border-[#0b0f19] shadow-lg object-cover bg-slate-150"
              />
            </div>

            <div className="px-6 pb-6 w-full">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                {user?.name}
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 mb-4">{user?.email}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic bg-slate-100/50 dark:bg-slate-950/20 p-3 rounded-xl w-full border border-slate-200/20 dark:border-slate-800/30">
                {user?.bio || 'No bio written yet. Introduce yourself to the workspace.'}
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <div className="flex items-center gap-2 mb-4">
              <FiTrendingUp className="text-violet-500" size={18} />
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Workspace Progress</h4>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <span>Task Completion</span>
                  <span>{completionPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-950/40 rounded-full overflow-hidden border border-slate-200/10 dark:border-slate-800/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center pt-2">
                <div className="p-3 bg-slate-100/50 dark:bg-slate-950/25 rounded-xl border border-slate-200/20">
                  <p className="text-[10px] uppercase font-semibold text-slate-500">Completed</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">{stats.completed}</p>
                </div>
                <div className="p-3 bg-slate-100/50 dark:bg-slate-950/25 rounded-xl border border-slate-200/20">
                  <p className="text-[10px] uppercase font-semibold text-slate-500">Remaining</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">{stats.total - stats.completed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-200/50 dark:border-slate-800/40 pb-4 flex items-center gap-2">
              <FiUser size={18} className="text-violet-500" />
              <span>Modify Profile Details</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="glass-input text-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                  Bio / Role Description
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Lead QA Engineer at Stripe Dashboard project..."
                  rows={3}
                  className="glass-input text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2 pl-0.5 flex items-center gap-1.5">
                    <FiImage size={14} />
                    Upload Avatar
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:border-violet-500/50 transition-colors">
                    {avatar ? (
                      <img src={avatar} alt="Avatar preview" className="h-20 w-20 rounded-full object-cover" />
                    ) : (
                      <FiUploadCloud className="text-slate-400" size={24} />
                    )}
                    <span className="text-xs text-slate-500 text-center">
                      {avatarFile ? avatarFile.name : 'Choose avatar image'}
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
                  <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2 pl-0.5 flex items-center gap-1.5">
                    <FiImage size={14} />
                    Upload Cover Image
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:border-violet-500/50 transition-colors">
                    {coverImage ? (
                      <img src={coverImage} alt="Cover preview" className="h-20 w-full rounded-xl object-cover" />
                    ) : (
                      <FiUploadCloud className="text-slate-400" size={24} />
                    )}
                    <span className="text-xs text-slate-500 text-center">
                      {coverFile ? coverFile.name : 'Choose cover image'}
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
                <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-3 pl-0.5">
                  Or choose a preset avatar
                </label>
                <div className="flex flex-wrap gap-3">
                  {avatarPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setAvatar(preset);
                        setAvatarFile(null);
                      }}
                      className={`h-14 w-14 rounded-full overflow-hidden border-2 transition-all ${
                        avatar === preset
                          ? 'border-violet-500 scale-105 ring-2 ring-violet-500/20'
                          : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <img src={preset} alt="preset avatar" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-slate-200/50 dark:border-slate-800/40 my-6" />

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <FiKey size={16} className="text-violet-500" />
                  <span>Update Password</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[11px] font-semibold text-slate-450 dark:text-slate-400 mb-1.5 pl-0.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="glass-input text-sm"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[11px] font-semibold text-slate-455 dark:text-slate-400 mb-1.5 pl-0.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="glass-input text-sm"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-450 dark:text-slate-500 flex items-center gap-1.5 pl-0.5">
                  <FiInfo size={12} />
                  <span>Leave blank if you do not wish to modify your active password.</span>
                </p>
              </div>

              <div className="flex justify-end border-t border-slate-200/50 dark:border-slate-800/40 pt-6 mt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/10 hover:-translate-y-0.5 active:translate-y-0 transition-all outline-none text-sm disabled:opacity-50"
                >
                  <FiSave size={16} />
                  <span>{saving ? 'Saving updates...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
