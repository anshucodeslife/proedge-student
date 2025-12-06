import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Mail, Shield } from 'lucide-react';

export const Profile = () => {
  const { user } = useSelector(state => state.auth);
  // Ideally we should have a separate profile slice or state if the user object in auth is just a token shell.
  // But for now, assuming auth.user is populated via login/signup.
  // We can add a refresh profile call here if needed.

  // Hardcoded fallback for demo if fields missing
  const displayUser = {
    name: user?.name || user?.fullName || 'Student',
    email: user?.email || 'student@example.com',
    role: user?.role || 'STUDENT',
    avatar: user?.avatar || 'https://ui-avatars.com/api/?name=' + (user?.name || 'Student'),
    id: user?.studentId || user?.id || 'N/A'
  };

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
            <img src={displayUser.avatar} alt={displayUser.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">{displayUser.name}</h3>
          <p className="text-slate-500 text-sm mb-4">{displayUser.email}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
            <Shield size={12} />
            {displayUser.role}
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Personal Information</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" value={displayUser.name} readOnly />
              <Input label="Student ID" value={displayUser.id} readOnly />
            </div>
            <Input label="Email Address" value={displayUser.email} readOnly />

            {/* Password Change Section Omitted for MVP */}
          </form>
        </Card>
      </div>
    </div>
  );
};
