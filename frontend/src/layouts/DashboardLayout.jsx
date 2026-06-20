import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
const DashboardLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0b0f19] dark-gradient-bg">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 pb-24 lg:pb-6 lg:mr-4 lg:mb-4 lg:rounded-2xl glass-panel lg:border lg:border-slate-200/40 lg:dark:border-slate-800/20 bg-white/40 dark:bg-slate-900/10 shadow-inner">
          <Outlet />
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
};

export default DashboardLayout;
