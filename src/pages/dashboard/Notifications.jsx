import React, { useEffect, useState } from 'react';
import { studentApi } from '../../api';
import { Card } from '../../components/ui/Card';
import { Bell, Check } from 'lucide-react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await studentApi.getNotifications();
      setNotifications(res.data);
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading notifications...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
        <p className="text-slate-500">Stay updated with latest announcements</p>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <Card key={notif.id} className={`p-4 flex gap-4 transition-all ${!notif.read ? 'bg-indigo-50/50 border-indigo-100' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!notif.read ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className={`font-semibold ${!notif.read ? 'text-indigo-900' : 'text-slate-700'}`}>{notif.title}</h3>
                <span className="text-xs text-slate-400">{notif.date}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
            </div>
            {!notif.read && (
              <button className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full transition-colors" title="Mark as read">
                <Check size={18} />
              </button>
            )}
          </Card>
        ))}
        
        {notifications.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p>No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};
