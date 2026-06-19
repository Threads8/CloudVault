import React from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Search files, folders...' }) => {
  return (
    <div className="relative w-full max-w-md group">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary">
        search
      </span>
      <input
        type="text"
        className="w-full bg-surface-container-high border-none rounded-full pl-10 pr-4 py-2 text-body-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
