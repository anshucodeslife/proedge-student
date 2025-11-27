import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { logout } from '../../store/slices/authSlice';

export const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setMobileOpen(false)} 
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full transition-all duration-300">
        <Navbar 
          onMenuClick={() => setMobileOpen(true)} 
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
