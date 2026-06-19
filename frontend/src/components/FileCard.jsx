import React from 'react';

const getFileIcon = (fileType, fileName) => {
  const ext = fileName?.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext) || fileType?.startsWith('image/')) {
    return { icon: 'image', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', label: ext.toUpperCase() };
  }
  if (['pdf'].includes(ext) || fileType === 'application/pdf') {
    return { icon: 'picture_as_pdf', color: 'text-error', bg: 'bg-error/10', border: 'border-error/20', label: 'PDF' };
  }
  if (['doc', 'docx'].includes(ext)) {
    return { icon: 'description', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', label: 'DOC' };
  }
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return { icon: 'table_chart', color: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/20', label: 'XLS' };
  }
  if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext) || fileType?.startsWith('video/')) {
    return { icon: 'movie', color: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/20', label: 'VIDEO' };
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return { icon: 'folder_zip', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', label: 'ZIP' };
  }
  if (['mp3', 'wav', 'flac', 'ogg'].includes(ext) || fileType?.startsWith('audio/')) {
    return { icon: 'audio_file', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', label: 'AUDIO' };
  }
  return { icon: 'insert_drive_file', color: 'text-on-surface-variant', bg: 'bg-surface-variant/20', border: 'border-outline-variant', label: 'FILE' };
};

const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const FileCard = ({ file, onDownload, onDelete, onShare }) => {
  const { icon, color, bg, border, label } = getFileIcon(file.fileType, file.fileName);
  const timeAgo = new Date(file.createdAt).toLocaleDateString();

  return (
    <div className="glass-card rounded-2xl p-4 group hover:bg-surface-variant/10 transition-all duration-300 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-16 ${bg} border ${border} rounded-lg flex flex-col items-center justify-center ${color}`}>
          <span className="material-symbols-outlined text-[32px]">{icon}</span>
          <span className="text-[8px] font-bold mt-1">{label}</span>
        </div>
        <div className="relative">
          <button
            className="p-1 hover:bg-surface-variant rounded-md transition-colors text-on-surface-variant"
            onClick={(e) => {
              e.stopPropagation();
              const menu = e.currentTarget.nextElementSibling;
              menu.classList.toggle('hidden');
            }}
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
          <div className="hidden absolute right-0 top-full mt-1 w-40 bg-surface-container-high rounded-xl shadow-2xl border border-outline-variant z-20 py-1 overflow-hidden">
            {onDownload && (
              <button onClick={() => onDownload(file._id, file.fileName)} className="w-full flex items-center gap-2 px-4 py-2.5 text-body-sm text-on-surface hover:bg-surface-variant/50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download
              </button>
            )}
            {onShare && (
              <button onClick={() => onShare(file._id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-body-sm text-on-surface hover:bg-surface-variant/50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">share</span>
                Share
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(file._id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-body-sm text-error hover:bg-error/10 transition-colors">
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
      <div>
        <h5 className="font-semibold text-on-surface truncate mb-1">{file.fileName}</h5>
        <div className="flex justify-between items-center text-label-md text-on-surface-variant">
          <span>{formatBytes(file.fileSize)}</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
