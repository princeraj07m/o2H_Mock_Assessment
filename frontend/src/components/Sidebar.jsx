import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiPlusSquare, FiUser, FiLogOut, FiX, FiCheckSquare } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: FiGrid },
    { name: 'Add Task', path: '/add', icon: FiPlusSquare },
    { name: 'Profile', path: '/profile', icon: FiUser },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-slate-200/50 dark:border-slate-800/40 p-5 flex flex-col justify-between
    transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-2rem)] lg:my-4 lg:ml-4 lg:rounded-2xl
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-35 bg-slate-900/45 dark:bg-slate-950/65 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside className={sidebarClasses}>
        {/* Top Section */}
        <div>
          {/* Logo / Header */}
          <div className="flex justify-between items-center mb-8 px-2">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <FiCheckSquare size={20} />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-slate-850 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Taskly.io
              </span>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500 hover:text-slate-855 lg:hidden outline-none"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => isOpen && toggleSidebar()}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 outline-none
                    ${
                      isActive
                        ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/15'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-150/50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Profile summary & Logout */}
        <div className="space-y-4 border-t border-slate-200/50 dark:border-slate-800/40 pt-4">
          {user && (
            <div className="flex items-center gap-3 px-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full border border-violet-500/20 bg-slate-100 object-cover"
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-450 dark:text-slate-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all outline-none"
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
