import React from 'react';
import { FiMenu, FiSun, FiMoon, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { useLocation } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { search, setSearch } = useTasks();
  const location = useLocation();

  const getHeading = () => {
    switch (location.pathname) {
      case '/add':
        return 'Create Task';
      case '/profile':
        return 'Profile';
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
    <header className="glass-panel border-b border-slate-200/50 dark:border-slate-800/40 px-3 sm:px-5 py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:rounded-2xl lg:mt-4 lg:mr-4 lg:mb-2 shadow-sm shrink-0">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          aria-label="Open menu"
          className="touch-target p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-slate-500 hover:text-slate-800 dark:hover:text-white lg:hidden outline-none shrink-0"
        >
          <FiMenu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-800 dark:text-white m-0 leading-tight truncate">
            {getHeading()}
          </h1>
          {isDashboard && user && (
            <p className="text-[11px] sm:text-xs text-slate-450 dark:text-slate-400 mt-0.5 font-medium truncate">
              {getGreeting()},{' '}
              <span className="text-violet-500 font-semibold">{user.name.split(' ')[0]}</span>
            </p>
          )}
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="touch-target p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-slate-500 hover:text-violet-500 dark:hover:text-violet-400 border border-slate-200/50 dark:border-slate-850 outline-none transition-all ml-auto sm:ml-0 lg:ml-auto shrink-0"
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>

      {isDashboard && (
        <div className="flex items-center w-full sm:flex-1 sm:max-w-md relative">
          <FiSearch className="absolute left-3.5 text-slate-400 pointer-events-none" size={16} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full glass-input pl-10 pr-4 py-2.5 text-sm rounded-xl"
          />
        </div>
      )}
    </header>
  );
};

export default Navbar;
