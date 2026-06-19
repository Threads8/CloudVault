import React, { useState, useEffect, useContext } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import AnalyticsCard from '../components/AnalyticsCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { storageStats, fetchStorageStats } = useOutletContext() || {};
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/analytics/activity');
      setActivities(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  useEffect(() => {
    const initData = async () => {
      await Promise.all([
        fetchStorageStats ? fetchStorageStats() : Promise.resolve(),
        fetchActivities()
      ]);
      setLoading(false);
    };
    
    initData();

    // Poll activities every 5 seconds for real-time dashboard updates
    const interval = setInterval(fetchActivities, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Dynamically compute upload activity by day of the week
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const uploadCounts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
  
  activities.forEach(act => {
    if (act.action === 'upload') {
      const dayName = days[new Date(act.createdAt).getDay()];
      if (uploadCounts[dayName] !== undefined) {
        uploadCounts[dayName]++;
      }
    }
  });

  const chartData = [
    { name: 'Mon', uploads: uploadCounts.Mon },
    { name: 'Tue', uploads: uploadCounts.Tue },
    { name: 'Wed', uploads: uploadCounts.Wed },
    { name: 'Thu', uploads: uploadCounts.Thu },
    { name: 'Fri', uploads: uploadCounts.Fri },
    { name: 'Sat', uploads: uploadCounts.Sat },
    { name: 'Sun', uploads: uploadCounts.Sun },
  ];

  // Dynamically compute category distribution
  const types = storageStats?.types || { image: 0, video: 0, document: 0, archive: 0, other: 0 };
  const totalCount = types.image + types.video + types.document + types.archive + types.other;

  const pieData = [
    { name: 'Images', value: totalCount ? Math.round((types.image / totalCount) * 100) : 0, color: '#adc6ff' },
    { name: 'Videos', value: totalCount ? Math.round((types.video / totalCount) * 100) : 0, color: '#a4c9ff' },
    { name: 'Documents', value: totalCount ? Math.round((types.document / totalCount) * 100) : 0, color: '#ffb786' },
    { name: 'Archives', value: totalCount ? Math.round((types.archive / totalCount) * 100) : 0, color: '#4d8eff' },
    { name: 'Others', value: totalCount ? Math.round((types.other / totalCount) * 100) : 0, color: '#32353c' },
  ].filter(item => item.value > 0);

  const finalPieData = pieData.length > 0 ? pieData : [
    { name: 'No Files', value: 100, color: '#32353c' }
  ];

  const getActivityIcon = (action) => {
    const map = {
      upload: { icon: 'upload_file', bg: 'bg-primary/20', text: 'text-primary' },
      download: { icon: 'download', bg: 'bg-secondary/20', text: 'text-secondary' },
      share: { icon: 'share', bg: 'bg-tertiary/20', text: 'text-tertiary' },
      delete: { icon: 'delete', bg: 'bg-error/20', text: 'text-error' },
      rename_file: { icon: 'edit', bg: 'bg-secondary/20', text: 'text-secondary' },
    };
    return map[action] || { icon: 'info', bg: 'bg-surface-variant/20', text: 'text-on-surface-variant' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-[3px] border-current border-t-transparent text-primary rounded-full" />
      </div>
    );
  }

  const used = storageStats?.totalStorageUsed || 0;
  const limit = storageStats?.totalStorageLimit || 15 * 1024 * 1024 * 1024;
  const storagePercent = Math.min((used / limit) * 100, 100);

  return (
    <div className="space-y-gutter animate-fade-in text-on-surface">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
        <div>
          <h2 className="text-headline-lg text-on-surface">Cloud Overview</h2>
          <p className="text-on-surface-variant">Welcome back, {user?.name}. Your storage health is optimal today.</p>
        </div>
        <div className="flex gap-stack-sm">
          <button className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface rounded-xl hover:bg-surface-variant transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            Filter
          </button>
        </div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Storage Card */}
        <div className="glass-card rounded-3xl p-glass-padding flex flex-col justify-between group transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/10 text-primary rounded-xl transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_queue</span>
            </div>
          </div>
          <div className="mt-stack-lg">
            <p className="text-on-surface-variant font-semibold text-label-md uppercase tracking-wider">Storage Used</p>
            <h3 className="text-headline-md font-bold mt-1">{formatBytes(used)}</h3>
            <div className="mt-4">
              <div className="w-full h-1 storage-track rounded-full overflow-hidden">
                <div className="h-full storage-fill" style={{ width: `${storagePercent}%` }} />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-on-surface-variant font-bold">{storagePercent.toFixed(1)}% of {formatBytes(limit)} used</span>
              </div>
            </div>
          </div>
        </div>

        <AnalyticsCard
          icon="insert_drive_file"
          iconBg="bg-secondary/10 text-secondary"
          label="Total Files"
          value={storageStats?.fileCount?.toLocaleString() || '0'}
          subtitle="Stored in Azure Blob Storage"
        >
          <div className="flex items-center text-primary">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span className="text-label-md ml-1">Active</span>
          </div>
        </AnalyticsCard>

        <AnalyticsCard
          icon="share"
          iconBg="bg-tertiary/10 text-tertiary"
          label="Shared Links"
          value={storageStats?.totalShared?.toString() || '0'}
          subtitle="Active share links"
        />

        <AnalyticsCard
          icon="download_for_offline"
          iconBg="bg-error-container/20 text-error"
          label="Platform"
          value="Azure"
          subtitle="Blob Storage Connected"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Bar Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-glass-padding">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-headline-md text-on-surface">Upload Activity</h4>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-label-md text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-primary" />Uploads</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#c2c6d6', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1d2027', border: '1px solid #424754', borderRadius: '12px', color: '#e1e2ec' }}
              />
              <Bar dataKey="uploads" fill="rgba(173, 198, 255, 0.4)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass-card rounded-3xl p-glass-padding flex flex-col">
          <h4 className="text-headline-md text-on-surface mb-6">File Categories</h4>
          <div className="flex-1 flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={finalPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {finalPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 w-full space-y-2">
              {finalPieData.map(item => (
                <div key={item.name} className="flex justify-between items-center text-body-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-glass-padding">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-headline-md text-on-surface">Recent Activity</h4>
            <Link to="/files" className="text-primary text-body-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="space-y-stack-md custom-scrollbar overflow-y-auto max-h-[400px] pr-2">
            {activities.length > 0 ? activities.slice(0, 5).map((act, i) => {
              const iconData = getActivityIcon(act.action);
              return (
                <div key={i} className="flex items-center justify-between p-4 bg-surface-variant/10 rounded-xl hover:bg-surface-variant/20 transition-colors border border-transparent hover:border-outline-variant group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${iconData.bg} ${iconData.text} rounded-xl flex items-center justify-center`}>
                      <span className="material-symbols-outlined">{iconData.icon}</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-on-surface">{act.target || 'File activity'}</h5>
                      <p className="text-body-sm text-on-surface-variant">{act.action} • {new Date(act.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] mb-2 opacity-30">inbox</span>
                <p>No recent activity yet. Start by uploading some files!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-3xl p-glass-padding">
          <h4 className="text-headline-md text-on-surface mb-6">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/files" className="flex flex-col items-center justify-center p-6 bg-primary-container text-on-primary-container rounded-2xl hover:brightness-110 transition-all active:scale-95 group">
              <span className="material-symbols-outlined text-[40px] mb-2 group-hover:rotate-12 transition-transform">upload_file</span>
              <span className="font-bold">Upload File</span>
            </Link>
            <Link to="/folders" className="flex flex-col items-center justify-center p-6 bg-secondary-container text-on-secondary-container rounded-2xl hover:brightness-110 transition-all active:scale-95 group">
              <span className="material-symbols-outlined text-[40px] mb-2 group-hover:scale-110 transition-transform">create_new_folder</span>
              <span className="font-bold">New Folder</span>
            </Link>
            <Link to="/shared" className="col-span-2 flex flex-col items-center justify-center p-6 bg-surface-container-high border border-outline-variant text-on-surface rounded-2xl hover:bg-surface-variant/40 transition-all active:scale-95 group">
              <span className="material-symbols-outlined text-[40px] mb-2 text-primary">person_add</span>
              <span className="font-bold">Shared Files</span>
            </Link>
          </div>

          {/* Upgrade Teaser */}
          <div className="mt-8 p-6 bg-gradient-to-br from-primary-container/20 to-secondary-container/20 border border-primary/20 rounded-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h5 className="font-bold text-primary">Need more space?</h5>
              <p className="text-body-sm text-on-surface-variant mt-2">Upgrade to Azure Premium for unlimited storage.</p>
              <button className="mt-4 px-4 py-2 bg-primary text-on-primary font-bold rounded-lg text-body-sm shadow-lg hover:shadow-primary/20 transition-all">Upgrade Now</button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] text-primary/10 select-none pointer-events-none rotate-12">rocket_launch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
