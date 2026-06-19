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
    fixed inset-y-0 left-0 z-40 w-[min(85vw,280px)] glass-panel border-r border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-5 flex flex-col justify-between
    transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 lg:h-[calc(100dvh-2rem)] lg:my-4 lg:ml-4 lg:rounded-2xl
    pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-35 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside className={sidebarClasses}>
        <div>
          <div className="flex justify-between items-center mb-6 sm:mb-8 px-1">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <FiCheckSquare size={20} />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-slate-850 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Taskly.io
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              aria-label="Close menu"
              className="touch-target p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500 lg:hidden outline-none"
            >
              <FiX size={20} />
            </button>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => isOpen && toggleSidebar()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none min-h-[48px] ${
                      isActive
                        ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/15'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-150/50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-white active:scale-[0.98]'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 border-t border-slate-200/50 dark:border-slate-800/40 pt-4">
          {user && (
            <div className="flex items-center gap-3 px-2 py-1">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full border border-violet-500/20 bg-slate-100 object-cover shrink-0"
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
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 active:bg-red-500/15 transition-all outline-none min-h-[48px]"
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
