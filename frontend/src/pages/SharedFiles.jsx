import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const SharedFiles = () => {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSharedFiles = async () => {
    try {
      const response = await api.get('/files');
      // Filter out files that don't have a shareLink
      const shared = (response.data || []).filter(file => file.shareLink && file.shareLink.linkId);
      setSharedFiles(shared);
    } catch (error) {
      toast.error('Failed to load shared files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  const handleRevoke = async (linkId) => {
    if (!window.confirm('Are you sure you want to revoke this share link?')) return;
    try {
      await api.delete(`/share/${linkId}`);
      toast.success('Share link revoked');
      fetchSharedFiles(); // Refresh list
    } catch (error) {
      toast.error('Failed to revoke link');
    }
  };

  const copyToClipboard = (linkId) => {
    const url = `${window.location.origin}/share/${linkId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const filteredFiles = sharedFiles.filter(f => 
    (f.fileName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-gutter animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-headline-lg text-on-surface">Shared Files</h2>
          <p className="text-on-surface-variant mt-1">Monitor and manage access to your shared public links</p>
        </div>
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">search</span>
          <input 
            type="text" 
            placeholder="Search shared files..." 
            className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-body-sm text-on-surface transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-outline-variant/30">
        <div className="px-6 py-4 border-b border-outline-variant/30 bg-surface-container/50">
          <h3 className="font-bold text-body-lg text-on-surface">Active Share Links ({filteredFiles.length})</h3>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin w-8 h-8 border-[3px] border-current border-t-transparent text-primary rounded-full" />
          </div>
        ) : filteredFiles.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-body-sm whitespace-nowrap">
              <thead className="bg-surface-container text-label-md text-on-surface-variant uppercase border-b border-outline-variant/30">
                <tr>
                  <th className="px-6 py-4 font-semibold">File Name</th>
                  <th className="px-6 py-4 font-semibold">Size</th>
                  <th className="px-6 py-4 font-semibold">Downloads</th>
                  <th className="px-6 py-4 font-semibold">Expires</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredFiles.map((file) => (
                  <tr key={file._id} className="hover:bg-surface-variant/10 text-on-surface transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center min-w-0">
                        <span className="material-symbols-outlined text-primary text-[20px] mr-3" style={{ fontVariationSettings: "'FILL' 1" }}>insert_drive_file</span>
                        <span className="font-semibold truncate max-w-[240px] md:max-w-xs">{file.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{formatBytes(file.fileSize)}</td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {file.shareLink.downloads} / {file.shareLink.downloadLimit || '∞'}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {file.shareLink.expiresAt ? new Date(file.shareLink.expiresAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => copyToClipboard(file.shareLink.linkId)}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                          title="Copy Link"
                        >
                          <span className="material-symbols-outlined text-[18px]">link</span>
                        </button>
                        <a 
                          href={`/share/${file.shareLink.linkId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded-xl transition-colors flex items-center justify-center"
                          title="Open Link"
                        >
                          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        </a>
                        <button 
                          onClick={() => handleRevoke(file.shareLink.linkId)}
                          className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-colors"
                          title="Revoke Access"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-4 select-none pointer-events-none">share</span>
            <p className="text-body-md font-semibold text-on-surface mb-1">No Shared Files</p>
            <p className="text-body-sm text-on-surface-variant">You haven't generated any public share links yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedFiles;
