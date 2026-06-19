import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, you would have dedicated admin endpoints
  // For this mock, we just use placeholders or assume an endpoint exists
  // e.g. GET /api/admin/users
  useEffect(() => {
    // Mock fetch for demonstration
    const fetchUsers = async () => {
      try {
        // const res = await api.get('/admin/users');
        // setUsers(res.data);
        
        // Mock data
        setUsers([
          { _id: '1', name: 'Admin User', email: 'admin@cloudvault.com', role: 'admin', storageUsed: 1024 * 1024 * 50, createdAt: new Date().toISOString() },
          { _id: '2', name: 'John Doe', email: 'john@example.com', role: 'user', storageUsed: 1024 * 1024 * 1500, createdAt: new Date().toISOString() },
        ]);
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user? All their files will be deleted.')) return;
    toast.success('User deleted (Mock)');
    setUsers(users.filter(u => u._id !== id));
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-gutter animate-fade-in text-on-surface">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-error-container/20 text-error rounded-2xl flex items-center justify-center shadow-inner">
          <span className="material-symbols-outlined text-[28px]">admin_panel_settings</span>
        </div>
        <div>
          <h2 className="text-headline-lg font-bold">Admin Panel</h2>
          <p className="text-body-sm text-on-surface-variant">Manage users and system resources</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl flex items-center">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl mr-4 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
          </div>
          <div>
            <p className="text-body-sm text-on-surface-variant font-semibold">Total Users</p>
            <p className="text-headline-md font-bold text-on-surface">2,543</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl flex items-center">
          <div className="p-4 bg-secondary/10 text-secondary rounded-2xl mr-4 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>storage</span>
          </div>
          <div>
            <p className="text-body-sm text-on-surface-variant font-semibold">Total Storage Used</p>
            <p className="text-headline-md font-bold text-on-surface">4.2 TB</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl flex items-center">
          <div className="p-4 bg-tertiary/10 text-tertiary rounded-2xl mr-4 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>insert_drive_file</span>
          </div>
          <div>
            <p className="text-body-sm text-on-surface-variant font-semibold">Total Files</p>
            <p className="text-headline-md font-bold text-on-surface">145K</p>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="glass-card rounded-3xl overflow-hidden mt-8 border border-outline-variant/30">
        <div className="px-6 py-4 border-b border-outline-variant/30 bg-surface-container/50">
          <h3 className="font-bold text-body-lg text-on-surface">User Management</h3>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-body-sm whitespace-nowrap">
            <thead className="bg-surface-container text-label-md text-on-surface-variant uppercase border-b border-outline-variant/30">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Storage Used</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-surface-variant/10 text-on-surface transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mr-3 shadow-inner">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface">{u.name}</p>
                        <p className="text-[12px] text-on-surface-variant">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${u.role === 'admin' ? 'bg-tertiary/15 text-tertiary' : 'bg-surface-variant text-on-surface-variant'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{formatBytes(u.storageUsed)}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={u._id === user._id}
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
