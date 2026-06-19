import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AuthLayout = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <div className="animate-spin w-8 h-8 border-[3px] border-current border-t-transparent text-primary rounded-full" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center p-gutter overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      {/* Version Badge */}
      <div className="fixed top-0 left-0 p-gutter z-20 hidden md:block">
        <div className="bg-surface/30 backdrop-blur-md rounded-full px-4 py-2 inner-stroke border border-outline-variant/20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
          <span className="text-label-md text-on-surface-variant uppercase tracking-widest">v4.2 Premium Stable</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[440px]">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
