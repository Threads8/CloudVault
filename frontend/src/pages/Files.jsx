import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import FileCard from '../components/FileCard';
import FolderCard from '../components/FolderCard';
import UploadZone from '../components/UploadZone';

const Files = () => {
  const { searchQuery, fetchStorageStats } = useOutletContext() || {};
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  const [searchParams, setSearchParams] = useSearchParams();
  const folderId = searchParams.get('folderId') || null;

  const [currentFolder, setCurrentFolder] = useState(null); // null or folder object
  const [breadcrumbs, setBreadcrumbs] = useState([{ _id: null, folderName: 'My Files' }]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const fetchFiles = async (fId = folderId) => {
    try {
      const endpoint = fId && fId !== 'null' && fId !== 'undefined' ? `/files?folderId=${fId}` : '/files';
      const res = await api.get(endpoint);
      setFiles(res.data || []);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const fetchFolders = async (fId = folderId) => {
    try {
      const endpoint = fId && fId !== 'null' && fId !== 'undefined' ? `/folders?parentFolder=${fId}` : '/folders';
      const res = await api.get(endpoint);
      setFolders(res.data || []);
    } catch (err) {
      console.error('Error fetching folders:', err);
    }
  };

  useEffect(() => {
    const loadFolderData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchFiles(folderId), fetchFolders(folderId)]);
        if (folderId && folderId !== 'null' && folderId !== 'undefined') {
          const res = await api.get(`/folders/${folderId}`);
          setCurrentFolder(res.data.folder);
          setBreadcrumbs([
            { _id: null, folderName: 'My Files' },
            ...(res.data.path || [])
          ]);
        } else {
          setCurrentFolder(null);
          setBreadcrumbs([{ _id: null, folderName: 'My Files' }]);
        }
      } catch (err) {
        console.error('Error loading folder data:', err);
        setCurrentFolder(null);
        setBreadcrumbs([{ _id: null, folderName: 'My Files' }]);
      } finally {
        setLoading(false);
      }
    };

    loadFolderData();
  }, [folderId]);

  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      if (folderId && folderId !== 'null' && folderId !== 'undefined') {
        formData.append('folderId', folderId);
      }

      setUploading(true);
      setUploadProgress(0);

      try {
        await api.post('/files', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
          },
        });
        toast.success(`${file.name} uploaded successfully!`);
        await fetchFiles(folderId);
        fetchStorageStats?.();
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    }
  }, [folderId, fetchStorageStats]);

  const handleDownload = async (fileId, fileName) => {
    try {
      const res = await api.get(`/files/download/${fileId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Download failed');
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await api.delete(`/files/${fileId}`);
      toast.success('File deleted');
      setFiles(prev => prev.filter(f => f._id !== fileId));
      fetchStorageStats?.();
    } catch (err) {
      toast.error('Failed to delete file');
    }
  };

  const handleDeleteFolder = async (folder) => {
    if (!window.confirm(`Delete folder "${folder.folderName || folder.name}"? It must be empty.`)) return;
    try {
      await api.delete(`/folders/${folder._id}`);
      toast.success('Folder deleted');
      fetchFolders(folderId);
      fetchStorageStats?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete folder');
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await api.post('/folders', {
        folderName: newFolderName,
        parentFolder: folderId
      });
      toast.success('Folder created');
      setNewFolderName('');
      setShowCreateModal(false);
      fetchFolders(folderId);
      fetchStorageStats?.();
    } catch (error) {
      toast.error('Failed to create folder');
    }
  };

  const handleShare = async (fileId) => {
    try {
      const res = await api.post('/share/create', { fileId });
      const shareUrl = `${window.location.origin}/share/${res.data.linkId}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
      await fetchFiles(folderId);
      fetchStorageStats?.();
    } catch (err) {
      toast.error('Failed to create share link');
    }
  };

  // Filter and sort files
  let filteredFiles = files.filter(f => {
    if (!searchQuery) return true;
    return f.fileName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (sortBy === 'newest') filteredFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sortBy === 'oldest') filteredFiles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  if (sortBy === 'name') filteredFiles.sort((a, b) => a.fileName?.localeCompare(b.fileName));
  if (sortBy === 'size') filteredFiles.sort((a, b) => (b.fileSize || 0) - (a.fileSize || 0));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-[3px] border-current border-t-transparent text-primary rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-gutter">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {folderId && (
            <button
              onClick={() => {
                const parentCrumb = breadcrumbs[breadcrumbs.length - 2];
                if (parentCrumb && parentCrumb._id) {
                  setSearchParams({ folderId: parentCrumb._id });
                } else {
                  setSearchParams({});
                }
              }}
              className="p-2 hover:bg-surface-variant rounded-xl transition-colors text-on-surface mt-1"
              title="Go back"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}
          <div className="space-y-1">
            {/* Breadcrumbs */}
            <div className="flex items-center flex-wrap gap-1.5 text-body-sm text-on-surface-variant">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb._id || 'root'}>
                  {idx > 0 && (
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant/40 select-none">
                      chevron_right
                    </span>
                  )}
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="font-bold text-on-surface">
                      {crumb.folderName || crumb.name}
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        if (crumb._id) {
                          setSearchParams({ folderId: crumb._id });
                        } else {
                          setSearchParams({});
                        }
                      }}
                      className="hover:text-primary transition-colors flex items-center gap-1 font-semibold"
                    >
                      {idx === 0 && <span className="material-symbols-outlined text-[16px]">home</span>}
                      {crumb.folderName || crumb.name}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div>
              <h2 className="text-headline-lg text-on-surface leading-tight">
                {currentFolder ? currentFolder.folderName || currentFolder.name : 'My Files'}
              </h2>
              <p className="text-on-surface-variant text-body-sm">
                {currentFolder ? 'Managing files inside this folder' : 'Manage and organize your personal cloud assets'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* New Folder Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-on-primary rounded-xl font-semibold transition-all shadow-lg shadow-primary/20 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">create_new_folder</span>
            <span className="hidden sm:inline">New Folder</span>
          </button>

          <div className="flex items-center gap-2 glass-card p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-variant/50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm font-semibold transition-all ${
                viewMode === 'list' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-variant/50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
              List
            </button>
            <div className="w-[1px] h-4 bg-outline-variant mx-1" />
            <div className="relative">
              <button
                onClick={(e) => {
                  const menu = e.currentTarget.nextElementSibling;
                  menu.classList.toggle('hidden');
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg text-body-sm font-semibold transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">sort</span>
                Sort
              </button>
              <div className="sort-menu hidden absolute right-0 top-full mt-1 w-40 bg-surface-container-high rounded-xl shadow-2xl border border-outline-variant z-20 py-1">
                {[
                  { label: 'Newest', value: 'newest' },
                  { label: 'Oldest', value: 'oldest' },
                  { label: 'Name', value: 'name' },
                  { label: 'Size', value: 'size' },
                ].map(s => (
                  <button
                    key={s.value}
                    onClick={() => { setSortBy(s.value); document.querySelector('.sort-menu')?.classList.add('hidden'); }}
                    className={`w-full text-left px-4 py-2 text-body-sm hover:bg-surface-variant/50 transition-colors ${sortBy === s.value ? 'text-primary font-semibold' : 'text-on-surface'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <UploadZone onDrop={onDrop} uploading={uploading} uploadProgress={uploadProgress} />
        </div>
        <div className="md:col-span-4 glass-card rounded-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-body-lg font-bold text-on-surface">Upload Status</h3>
            <span className="material-symbols-outlined text-secondary">cloud_done</span>
          </div>
          {uploading ? (
            <div className="space-y-2">
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface">Uploading...</span>
                <span className="text-primary font-bold">{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(173,198,255,0.6)] transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-2 opacity-30">check_circle</span>
              <p className="text-body-sm">All uploads complete</p>
            </div>
          )}
          <div className="mt-auto pt-6 border-t border-outline-variant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              </div>
              <div>
                <p className="text-body-sm font-bold text-on-surface">Azure Connected</p>
                <p className="text-[12px] text-on-surface-variant">Blob Storage Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-headline-md text-on-surface">Folders</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {folders.map((folder, i) => (
              <FolderCard 
                key={folder._id} 
                folder={folder} 
                index={i} 
                onClick={(f) => setSearchParams({ folderId: f._id })}
                onDelete={handleDeleteFolder}
              />
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-headline-md text-on-surface">Files ({filteredFiles.length})</h3>
        </div>

        {filteredFiles.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredFiles.map(file => (
                <FileCard
                  key={file._id}
                  file={file}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onShare={handleShare}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-outline-variant text-label-md text-on-surface-variant uppercase">
                <span className="col-span-5">Name</span>
                <span className="col-span-2 hidden md:block">Size</span>
                <span className="col-span-3 hidden md:block">Date</span>
                <span className="col-span-2 text-right">Actions</span>
              </div>
              {filteredFiles.map(file => (
                <div key={file._id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-outline-variant/30 hover:bg-surface-variant/10 transition-colors items-center">
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <span className="material-symbols-outlined text-primary">insert_drive_file</span>
                    <span className="truncate text-on-surface font-medium">{file.fileName}</span>
                  </div>
                  <div className="col-span-2 hidden md:block text-on-surface-variant text-body-sm">
                    {file.fileSize ? `${(file.fileSize / 1024 / 1024).toFixed(1)} MB` : '-'}
                  </div>
                  <div className="col-span-3 hidden md:block text-on-surface-variant text-body-sm">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-2 flex justify-end gap-1">
                    <button onClick={() => handleDownload(file._id, file.fileName)} className="p-1.5 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                    <button onClick={() => handleShare(file._id)} className="p-1.5 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">share</span>
                    </button>
                    <button onClick={() => handleDelete(file._id)} className="p-1.5 hover:bg-error/10 rounded-lg transition-colors text-on-surface-variant hover:text-error">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center text-center py-16 opacity-40">
            <span className="material-symbols-outlined text-[48px] mb-4">cloud_off</span>
            <p>{searchQuery ? 'No files match your search.' : 'No files yet. Use the upload zone above to get started!'}</p>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 shadow-2xl animate-slide-up relative bg-surface border border-outline-variant">
            <h3 className="text-headline-md font-bold text-on-surface mb-4">Create New Folder</h3>
            <form onSubmit={handleCreateFolder}>
              <div className="mb-6">
                <label className="block text-body-sm font-semibold text-on-surface-variant mb-2">Folder Name</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface transition-all"
                  placeholder="e.g., Important Documents"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 hover:bg-surface-variant text-on-surface rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-primary/95 text-on-primary rounded-xl font-semibold transition-all shadow-lg shadow-primary/20"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
