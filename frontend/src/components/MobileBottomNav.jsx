import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiGrid, FiPlusSquare, FiUser } from 'react-icons/fi';

const MobileBottomNav = () => {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/', icon: FiGrid },
    { name: 'Add', path: '/add', icon: FiPlusSquare },
    { name: 'Profile', path: '/profile', icon: FiUser },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 glass-panel border-t border-slate-200/60 dark:border-slate-800/60 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-around px-2 pt-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(link.path);

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl mx-0.5 transition-colors outline-none min-h-[56px] ${
                isActive
                  ? 'text-violet-600 dark:text-violet-400 bg-violet-500/10'
                  : 'text-slate-500 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-800/60'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold tracking-wide">{link.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
