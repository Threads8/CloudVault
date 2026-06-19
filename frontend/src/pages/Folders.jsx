import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import FolderCard from '../components/FolderCard';

const Folders = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState(null); // null means root
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const fetchFolders = async (parentId = null) => {
    try {
      const endpoint = parentId ? `/folders?parentFolder=${parentId}` : '/folders';
      const response = await api.get(endpoint);
      setFolders(response.data || []);
    } catch (error) {
      toast.error('Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders(currentFolder);
  }, [currentFolder]);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    try {
      await api.post('/folders', {
        folderName: newFolderName,
        parentFolder: currentFolder
      });
      toast.success('Folder created');
      setNewFolderName('');
      setShowCreateModal(false);
      fetchFolders(currentFolder);
    } catch (error) {
      toast.error('Failed to create folder');
    }
  };

  const handleDelete = async (folder) => {
    if (!window.confirm(`Delete folder "${folder.folderName}"? It must be empty.`)) return;
    try {
      await api.delete(`/folders/${folder._id}`);
      setFolders(folders.filter(f => f._id !== folder._id));
      toast.success('Folder deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete folder');
    }
  };

  const filteredFolders = folders.filter(f => 
    (f.folderName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-gutter animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {currentFolder && (
            <button 
              onClick={() => setCurrentFolder(null)}
              className="p-2 hover:bg-surface-variant rounded-xl transition-colors text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}
          <div>
            <h2 className="text-headline-lg text-on-surface">My Folders</h2>
            <p className="text-on-surface-variant mt-1">Organize and group your cloud storage files</p>
          </div>
        </div>
        
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Search folders..." 
              className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-body-sm text-on-surface transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-on-primary rounded-xl font-semibold transition-all shadow-lg shadow-primary/20 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="hidden sm:inline">New Folder</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin w-8 h-8 border-[3px] border-current border-t-transparent text-primary rounded-full" />
        </div>
      ) : filteredFolders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredFolders.map((folder, i) => (
            <FolderCard 
              key={folder._id} 
              folder={folder} 
              onClick={() => navigate(`/files?folderId=${folder._id}`)}
              onDelete={handleDelete}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center rounded-3xl">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-4 select-none pointer-events-none">folder_off</span>
          <h3 className="text-headline-md font-bold mb-2 text-on-surface">No Folders Found</h3>
          <p className="mb-6 text-on-surface-variant max-w-sm mx-auto">Create a new folder to organize your files into clean categories.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-semibold transition-colors"
          >
            Create Folder
          </button>
        </div>
      )}

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

export default Folders;
