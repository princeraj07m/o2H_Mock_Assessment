import React from 'react';
import { FiMenu, FiSun, FiMoon, FiSearch, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { useLocation } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { search, setSearch } = useTasks();
  const location = useLocation();

  // Determine section heading
  const getHeading = () => {
    switch (location.pathname) {
      case '/add':
        return 'Create Task';
      case '/profile':
        return 'Profile Settings';
      default:
        if (location.pathname.startsWith('/edit')) {
          return 'Edit Task';
        }
        return 'Overview';
    }
  };

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const isDashboard = location.pathname === '/';

  return (
    <header className="glass-panel border-b border-slate-200/50 dark:border-slate-800/40 px-6 py-4 flex items-center justify-between gap-4 lg:rounded-2xl lg:mt-4 lg:mr-4 lg:mb-2 shadow-sm">
      {/* Mobile Drawer Trigger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-slate-500 hover:text-slate-800 dark:hover:text-white lg:hidden outline-none"
        >
          <FiMenu size={20} />
        </button>

        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white m-0 leading-none">
            {getHeading()}
          </h1>
          {isDashboard && user && (
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-1 font-medium hidden sm:block">
              {getGreeting()}, <span className="text-violet-500 font-semibold">{user.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* Center Search Bar - Only show on Dashboard */}
      {isDashboard ? (
        <div className="hidden md:flex items-center flex-1 max-w-md relative mx-4">
          <FiSearch className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, descriptions, notes..."
            className="w-full glass-input pl-10 pr-4 py-2 text-sm rounded-xl"
          />
        </div>
      ) : (
        <div className="hidden md:block flex-1" />
      )}

      {/* Right Icons: Theme, Notification & Quick Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile Search Icon Toggle (opens search or focuses if we wanted, let's keep it simple) */}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-slate-500 hover:text-violet-500 dark:hover:text-violet-400 border border-slate-200/50 dark:border-slate-850 outline-none transition-all duration-200"
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Dummy Notification Bell */}
        <button
          className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-slate-500 hover:text-slate-805 dark:hover:text-white border border-slate-200/50 dark:border-slate-850 outline-none relative transition-all"
        >
          <FiBell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-white dark:ring-[#0b0f19]" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
