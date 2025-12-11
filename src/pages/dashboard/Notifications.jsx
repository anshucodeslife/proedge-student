import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, AlertCircle, Info } from 'lucide-react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' ? true : !n.read
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-sm text-slate-600 mt-1">
            {unreadCount > 0 ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </span>
            ) : (
              'All caught up!'
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <CheckCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Mark All as Read</span>
            <span className="sm:hidden">Mark All</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-slate-100 p-1 inline-flex gap-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all'
              ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
            }`}
        >
          All <span className="ml-1 opacity-75">({notifications.length})</span>
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'unread'
              ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
            }`}
        >
          Unread <span className="ml-1 opacity-75">({unreadCount})</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-100">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No notifications</h3>
            <p className="text-sm text-slate-600">
              {filter === 'unread'
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-md p-4 sm:p-5 border transition-all hover:shadow-lg ${!notification.read
                  ? 'border-l-4 border-l-orange-500 border-t border-r border-b border-slate-100'
                  : 'border-slate-100'
                }`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${!notification.read
                    ? 'bg-gradient-to-br from-blue-500 to-orange-500'
                    : 'bg-slate-100'
                  }`}>
                  <Bell className={`w-5 h-5 ${!notification.read ? 'text-white' : 'text-slate-400'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full flex-shrink-0">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(notification.sentAt || notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
