import React, { useState, useEffect, useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import api from '../services/api';

const DashboardLayout = () => {
  const { user, loading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageStats, setStorageStats] = useState({
    totalStorageUsed: 0,
    totalStorageLimit: 15 * 1024 * 1024 * 1024,
    fileCount: 0,
    types: { image: 0, video: 0, document: 0, archive: 0, other: 0 }
  });

  const fetchStorageStats = async () => {
    try {
      const res = await api.get('/analytics/storage');
      setStorageStats(res.data || {});
    } catch (err) {
      console.error('Error fetching storage stats:', err);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    // Initial fetch
    fetchStorageStats();
    
    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchStorageStats, 5000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <div className="animate-spin w-8 h-8 border-[3px] border-current border-t-transparent text-primary rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} storageStats={storageStats} />

      {/* Main Content Wrapper */}
      <main className="lg:ml-[280px] min-h-screen flex flex-col">
        {/* Top Navbar */}
        <Navbar
          onMenuToggle={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Page Canvas */}
        <div className="mt-16 p-gutter flex-1 relative overflow-hidden pb-20 lg:pb-gutter">
          {/* Background decorative elements */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

          <Outlet context={{ searchQuery, storageStats, fetchStorageStats }} />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
};

export default DashboardLayout;
