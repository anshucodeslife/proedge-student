import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Mail, Shield } from 'lucide-react';

export const Profile = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
        <p className="text-slate-500">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="p-6 text-center h-fit">
          <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full mb-4 overflow-hidden border-4 border-white shadow-lg">
            <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">{user?.name}</h3>
          <p className="text-slate-500 text-sm mb-4">{user?.email}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
            <Shield size={12} />
            {user?.role}
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Personal Information</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" value={user?.name} readOnly />
              <Input label="Student ID" value={user?.id} readOnly />
            </div>
            <Input label="Email Address" value={user?.email} readOnly />
            
            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Input label="New Password" type="password" placeholder="••••••••" />
                <Input label="Confirm Password" type="password" placeholder="••••••••" />
              </div>
              <Button>Update Password</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
