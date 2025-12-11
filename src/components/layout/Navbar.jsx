
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User, Settings, LogOut, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

export const Navbar = ({ onMenuClick, isMobileMenuOpen }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  // Mock notifications - replace with real data
  const notifications = [
    { id: 1, title: 'New course available', message: 'Advanced React has been added', time: '2 hours ago', unread: true },
    { id: 2, title: 'Assignment due soon', message: 'JavaScript basics assignment due tomorrow', time: '5 hours ago', unread: true },
    { id: 3, title: 'Course completed', message: 'You completed HTML Fundamentals', time: '1 day ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-slate-100 px-4 sm:px-6 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Hamburger Menu - Mobile & Tablet */}
        <button
          className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>

        <h1 className="text-lg sm:text-xl font-bold text-slate-800">
          <span className="hidden sm:inline">Student Portal</span>
          <span className="sm:hidden">ProEdge</span>
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search - Desktop Only */}
        <div className="relative hidden lg:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="pl-10 pr-4 py-2 rounded-full bg-slate-50 text-sm w-48 xl:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>


        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-full border-2 border-white text-white text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown - With margins */}
          {showNotifications && (
            <div className="fixed right-4 left-4 sm:left-auto sm:right-4 top-20 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
              {/* Header - Compact */}
              <div className="p-3 bg-gradient-to-r from-blue-500 to-orange-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-white" />
                  <h3 className="font-semibold text-white text-sm">Notifications</h3>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Bell size={24} className="text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">No notifications yet</p>
                    <p className="text-xs text-slate-400 mt-1">We'll notify you when something arrives</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-all ${notification.unread ? 'bg-blue-50/40' : 'bg-white'
                        }`}
                    >
                      <div className="flex items-start gap-2">
                        {/* Icon - Smaller */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notification.unread
                            ? 'bg-gradient-to-br from-blue-500 to-orange-500'
                            : 'bg-slate-100'
                          }`}>
                          <Bell size={14} className={notification.unread ? 'text-white' : 'text-slate-400'} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-xs text-slate-800">
                              {notification.title}
                            </h4>
                            {notification.unread && (
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{notification.message}</p>
                          <span className="text-xs text-slate-400 mt-1 block">{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer - Compact */}
              {notifications.length > 0 && (
                <div className="p-2 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/notifications');
                    }}
                    className="w-full py-2 text-xs text-blue-600 hover:text-blue-700 font-semibold hover:bg-white rounded-lg transition-all"
                  >
                    View all notifications →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-slate-100 hover:bg-slate-50 rounded-lg transition-colors p-1"
          >
            <div className="text-right hidden md:block">
              <div className="text-sm font-semibold text-slate-700">{user?.fullName || user?.name || 'Student'}</div>
              <div className="text-xs text-slate-400">ID: {user?.studentId || user?.id || '...'}</div>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-indigo-100 flex-shrink-0">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName || 'Student'}&background=6366f1&color=fff`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div >
          </button >

          {/* Profile Dropdown Modal */}
          {
            showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-200">
                      <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName || 'Student'}&background=6366f1&color=fff`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate">{user?.fullName || user?.name || 'Student'}</h3>
                      <p className="text-xs text-slate-500 truncate">{user?.email || 'student@proedge.com'}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      navigate('/profile');
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3"
                  >
                    <User size={18} className="text-slate-400" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      navigate('/profile');
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3"
                  >
                    <Settings size={18} className="text-slate-400" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )
          }
        </div >
      </div >
    </header >
  );
};

