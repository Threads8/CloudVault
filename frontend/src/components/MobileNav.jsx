import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: 'dashboard' },
    { name: 'Files', path: '/files', icon: 'folder_shared' },
    { name: 'Shared', path: '/shared', icon: 'group' },
    { name: 'Settings', path: '/admin', icon: 'settings' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full h-16 bg-surface/90 backdrop-blur-xl border-t border-outline-variant flex items-center justify-around px-4 z-50">
      {navItems.map((item, i) => (
        <React.Fragment key={item.name}>
          {i === 2 && (
            <Link
              to="/files"
              className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center -translate-y-6 shadow-xl shadow-primary/30 active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined">add</span>
            </Link>
          )}
          <Link
            to={item.path}
            className={`flex flex-col items-center gap-1 ${
              isActive(item.path) ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive(item.path) ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-semibold">{item.name}</span>
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default MobileNav;
