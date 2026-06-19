import React, { useState } from 'react';

const folderColors = [
  { bg: 'bg-secondary/10', text: 'text-secondary' },
  { bg: 'bg-tertiary/10', text: 'text-tertiary' },
  { bg: 'bg-primary/10', text: 'text-primary' },
];

const FolderCard = ({ folder, onClick, onDelete, index = 0 }) => {
  const color = folderColors[index % folderColors.length];
  const [showMenu, setShowMenu] = useState(false);
  const name = folder.name || folder.folderName || 'Unnamed Folder';

  return (
    <div
      className="glass-card p-5 rounded-2xl group hover:bg-surface-variant/20 transition-all duration-300 cursor-pointer relative"
      onClick={() => onClick?.(folder)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 ${color.bg} rounded-xl flex items-center justify-center ${color.text} group-hover:scale-110 transition-transform`}>
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>folder</span>
        </div>
        {onDelete && (
          <div className="relative">
            <button
              className="p-1 hover:bg-surface-variant rounded-md transition-colors text-on-surface-variant"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div className="absolute right-0 top-full mt-1 w-32 bg-surface-container-high rounded-xl shadow-2xl border border-outline-variant z-20 py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete(folder);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-body-sm text-error hover:bg-error/10 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <h4 className="font-bold text-on-surface mb-1 truncate">{name}</h4>
      <p className="text-body-sm text-on-surface-variant">
        {folder.fileCount || 0} files
      </p>
    </div>
  );
};

export default FolderCard;
