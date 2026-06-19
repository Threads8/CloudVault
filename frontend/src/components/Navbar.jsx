import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onMenuToggle, searchQuery, onSearchChange }) => {
  const { user } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-280px)] z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm">
      <div className="flex justify-between items-center h-16 px-gutter">
        <div className="flex items-center gap-4 flex-grow max-w-xl">
          {/* Mobile logo + hamburger */}
          <button
            className="lg:hidden p-1 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors"
            onClick={onMenuToggle}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
            <span className="font-bold text-on-surface text-headline-md">CloudVault</span>
          </div>

          {/* Search */}
          <div className="hidden md:block w-full">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
            />
          </div>
        </div>

        <div className="flex items-center gap-stack-md ml-6">
          {/* Notification bell */}
          <button className="hidden md:block p-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-full transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          {/* Theme toggle */}
          <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />

          {/* User avatar */}
          <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden cursor-pointer active:scale-90 transition-transform bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
