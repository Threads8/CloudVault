import React from 'react';

const ThemeToggle = ({ darkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-full transition-colors"
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined">contrast</span>
    </button>
  );
};

export default ThemeToggle;
