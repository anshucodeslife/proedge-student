import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, Bell, Settings, LogOut, X, GraduationCap } from 'lucide-react';
import { cn } from '../ui/Button';

export const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/courses', icon: BookOpen, label: 'My Courses' },
    { to: '/attendance', icon: Calendar, label: 'Attendance' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/profile', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className={cn(
      "fixed md:relative z-50 bg-white h-full border-r border-slate-100 flex flex-col transition-all duration-300",
      isOpen ? "w-64" : "w-20",
      "md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="h-20 flex items-center px-6 border-b border-slate-50 justify-between">
        <div className={cn("flex items-center gap-2 font-bold text-xl text-slate-800 transition-all", !isOpen && "scale-0 w-0 overflow-hidden")}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0">
            <GraduationCap size={20} />
          </div>
          <span>Proedge</span>
        </div>
        
        {/* Mobile Close Button */}
        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-indigo-600">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
              isActive ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              !isOpen && "justify-center"
            )}
          >
            <item.icon size={20} />
            {isOpen && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-50">
        <button 
          onClick={onLogout}
          className={cn(
            "flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors",
            !isOpen && "justify-center"
          )}
        >
          <LogOut size={20} />
          {isOpen && <span className="font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
