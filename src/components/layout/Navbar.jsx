import React from 'react';
import { Menu, Bell, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';

export const Navbar = ({ onMenuClick, onToggleSidebar, isSidebarOpen }) => {
  const { user } = useSelector(state => state.auth);

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-500" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <button 
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
          onClick={onToggleSidebar}
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
        <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
          Student Portal
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="pl-10 pr-4 py-2 rounded-full bg-slate-50 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
          />
        </div>
        
        <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-slate-700">{user?.name || 'Student'}</div>
            <div className="text-xs text-slate-400">Student ID: {user?.id || '...'}</div>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100">
            <img src={user?.avatar || "https://ui-avatars.com/api/?name=Student"} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};
