import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Calendar, Edit2, Save, X, Key, Award, BookOpen, CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { InputField } from '../../components/ui/InputField';
import { fetchProfile, updateProfile, changePassword } from '../../store/slices/profileSlice';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { profile, loading } = useSelector(state => state.profile);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(formData));
    setIsEditing(false);
    dispatch(fetchProfile());
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    await dispatch(changePassword({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    }));

    setIsChangingPassword(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header with Avatar */}
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-slate-100">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 p-1">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <User className="w-12 h-12 text-slate-400" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-slate-800">{profile?.fullName || 'Student'}</h1>
            <p className="text-sm text-slate-600 mt-1">{profile?.email}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                ID: {profile?.studentId}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                {profile?.status || 'ACTIVE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <BookOpen className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="text-sm text-slate-600 font-medium">Total Enrollments</div>
          <div className="text-3xl font-bold text-slate-800 mt-1">{profile?._count?.enrollments || 0}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
              <Award className="text-orange-600" size={24} />
            </div>
          </div>
          <div className="text-sm text-slate-600 font-medium">Account Status</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{profile?.status || 'ACTIVE'}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="text-sm text-slate-600 font-medium">Member Since</div>
          <div className="text-lg font-bold text-slate-800 mt-1">
            {profile?.createdAt && new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Personal Information Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Edit2 size={16} />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700"
              >
                <Save size={16} />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    fullName: profile?.fullName || '',
                    email: profile?.email || ''
                  });
                }}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <User className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-600 font-medium">Full Name</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{profile?.fullName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Mail className="text-orange-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-600 font-medium">Email</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{profile?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-600 font-medium">Student ID</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{profile?.studentId}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Change Password Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Change Password</h2>
          {!isChangingPassword && (
            <Button
              variant="outline"
              onClick={() => setIsChangingPassword(true)}
              className="flex items-center gap-2 border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <Key size={16} />
              <span className="hidden sm:inline">Change Password</span>
              <span className="sm:hidden">Change</span>
            </Button>
          )}
        </div>

        {isChangingPassword ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <InputField
              label="Current Password"
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              required
            />
            <InputField
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <InputField
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700"
              >
                <Save size={16} />
                Update Password
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-slate-600">
            Keep your account secure by regularly updating your password.
          </p>
        )}
      </Card>
    </div>
  );
};
