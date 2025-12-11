import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { logout } from '../../store/slices/authSlice';
import { useResponsive } from '../../hooks/useResponsive';

export const Layout = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay - Full Screen */}
      {isMobileMenuOpen && (isMobile || isTablet) && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMobileMenu}
          />
          {/* Sidebar */}
          <div className="fixed inset-0 z-50 md:hidden">
            <Sidebar
              isOpen={true}
              onClose={closeMobileMenu}
              onLogout={handleLogout}
              isMobile={true}
            />
          </div>
        </>
      )}

      {/* Desktop Sidebar - Always Visible */}
      <div className="hidden md:block">
        <Sidebar
          isOpen={true}
          onClose={closeMobileMenu}
          onLogout={handleLogout}
          isMobile={false}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        <Navbar
          onMenuClick={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 scroll-smooth bg-slate-50">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
