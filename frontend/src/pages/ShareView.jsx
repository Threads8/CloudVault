import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

const ShareView = () => {
  const { linkId } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await api.get(`/share/${linkId}`);
        setFile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Shared file not found or expired');
      } finally {
        setLoading(false);
      }
    };
    fetchFileDetails();
  }, [linkId]);

  const handleDownload = async (e) => {
    e.preventDefault();
    setDownloading(true);
    try {
      const response = await api.post(`/share/${linkId}/download`, { password });
      
      // Use the pre-signed SAS URL to download the file directly
      const link = document.createElement('a');
      link.href = response.data.url;
      link.setAttribute('download', response.data.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-primary rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden text-on-surface">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-error/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-md w-full glass-card rounded-3xl p-8 text-center space-y-6 bg-surface/50 border border-outline-variant/30 relative z-10 glass-glow">
          <div className="w-16 h-16 bg-error-container text-error rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <span className="material-symbols-outlined text-[36px]">error</span>
          </div>
          <h1 className="text-headline-lg font-bold">Link Unavailable</h1>
          <p className="text-on-surface-variant">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden text-on-surface font-sans">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none animate-float-fast" />

      <div className="max-w-md w-full glass-card rounded-3xl p-8 relative z-10 shadow-2xl bg-surface/50 border border-outline-variant/30 glass-glow animate-card-entrance">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <span className="material-symbols-outlined text-[44px]" style={{ fontVariationSettings: "'FILL' 1" }}>insert_drive_file</span>
          </div>
          <h1 className="text-headline-lg font-bold text-on-surface mb-2 line-clamp-2">
            {file.fileName}
          </h1>
          <p className="text-on-surface-variant font-medium text-body-sm">
            {formatBytes(file.fileSize)} • {file.fileType}
          </p>
        </div>

        <form onSubmit={handleDownload} className="space-y-6">
          {file.isPasswordProtected && (
            <div className="space-y-2">
              <label className="text-body-sm font-semibold text-on-surface-variant ml-1">Password Required</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">lock</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface transition-all"
                  placeholder="Enter password to download"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={downloading}
            className="w-full py-4 px-4 bg-primary hover:bg-primary/95 text-on-primary rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {downloading ? (
              <div className="animate-spin inline-block w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full" />
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span>Download File</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShareView;
