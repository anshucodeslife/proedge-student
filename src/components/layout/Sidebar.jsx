
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, Bell, Settings, LogOut, X } from 'lucide-react';
import { cn } from '../ui/Button';

export const Sidebar = ({ isOpen, onClose, onLogout, isMobile }) => {
  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', color: 'from-blue-500 to-blue-700' },
    { to: '/courses', icon: BookOpen, label: 'My Courses', color: 'from-orange-500 to-orange-700' },
    { to: '/attendance', icon: Calendar, label: 'Attendance', color: 'from-blue-600 to-orange-600' },
    { to: '/notifications', icon: Bell, label: 'Notifications', color: 'from-orange-600 to-blue-600' },
    { to: '/profile', icon: Settings, label: 'Settings', color: 'from-blue-500 to-orange-500' },
  ];


  return (
    <aside className={cn(
      "h-full flex flex-col transition-all duration-300 shadow-xl",
      // Gradient background like Rajratan
      "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
      // Mobile: Full screen overlay
      isMobile ? "w-full max-w-xs" : "w-64",
      // Desktop: Fixed sidebar
      "relative"
    )}>
      {/* Header with Logo */}
      <div className="h-20 flex items-center px-6 border-b border-white/10 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg p-1.5">
            <img
              src="/proedge_logo.png"
              alt="ProEdge"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">ProEdge</h2>
            <p className="text-xs text-slate-400">Learning</p>
          </div>
        </div>

        {/* Close button - only on mobile */}
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={isMobile ? onClose : undefined}
            className={({ isActive }) => cn(
              "group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium relative overflow-hidden",
              isActive
                ? "bg-gradient-to-r " + item.color + " text-white shadow-lg shadow-orange-500/20"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            )}
          >
            {({ isActive }) => (
              <>
                {/* Icon with gradient background for active state */}
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                  isActive
                    ? "bg-white/20"
                    : "bg-white/5 group-hover:bg-white/10"
                )}>
                  <item.icon size={20} />
                </div>
                <span className="flex-1">{item.label}</span>

                {/* Active indicator */}
                {isActive && (
                  <div className="w-1 h-8 bg-white/30 rounded-full absolute right-2" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-white/10">
        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-4 py-3.5 w-full text-slate-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all text-sm font-medium group"
        >
          <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center transition-all">
            <LogOut size={20} />
          </div>
          <span className="flex-1">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
