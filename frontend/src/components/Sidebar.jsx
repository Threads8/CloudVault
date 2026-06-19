import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose, storageStats }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'My Files', path: '/files', icon: 'folder_shared' },
    { name: 'Folders', path: '/folders', icon: 'folder_copy' },
    { name: 'Shared', path: '/shared', icon: 'group' },
    ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin', icon: 'admin_panel_settings' }] : []),
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const formatBytes = (bytes, decimals = 1) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const used = storageStats?.totalStorageUsed || 0;
  const limit = storageStats?.totalStorageLimit || 15 * 1024 * 1024 * 1024;
  const pct = Math.min((used / limit) * 100, 100);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`h-screen w-[280px] fixed left-0 top-0 z-50 flex flex-col bg-surface/80 backdrop-blur-md border-r border-outline-variant shadow-sm transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col p-glass-padding gap-stack-md h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-4">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-on-primary-container shadow-lg shadow-primary-container/20">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
            </div>
            <div>
              <h1 className="text-headline-md font-bold text-on-surface leading-none">CloudVault</h1>
              <p className="text-on-surface-variant text-label-md uppercase tracking-widest mt-1">Premium Storage</p>
            </div>
          </div>

          {/* Upload CTA */}
          <Link
            to="/files"
            className="flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-2 mb-4"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Upload Center
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-grow">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 active:scale-95 ${
                  isActive(item.path)
                    ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-variant/50'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive(item.path) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Storage + Logout */}
          <div className="mt-auto space-y-4">
            <div className="p-4 glass-card rounded-2xl bg-surface-container-low/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-label-md text-on-surface-variant">STORAGE</span>
                <span className="text-label-md text-primary font-bold">{pct.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-body-sm text-on-surface-variant text-[12px] font-semibold">
                {formatBytes(used)} of {formatBytes(limit)}
              </p>
            </div>

            <button
              onClick={() => { logout(); onClose?.(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
