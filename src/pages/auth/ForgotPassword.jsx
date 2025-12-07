import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
      // In a real app, we might navigate to verify-otp here or let user click a link
      // For this flow, we'll show success and a button to go to verify
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50/50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 font-bold text-2xl text-slate-800">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <img src="/proedge_logo.png" alt="Proedge" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center gap-1 leading-none">
              <span className="tracking-tight text-orange-500">Proedge</span>
              <span className="tracking-tight text-slate-800">Learning</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password?</h1>
          <p className="text-slate-500">Enter your email to receive a reset code</p>
        </div>

        {!submitted ? (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@proedge.com"
            />

            <Button type="submit" isLoading={loading} className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200">
              Send OTP
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
              OTP sent successfully to <strong>{email}</strong>
            </div>
            <Button onClick={() => navigate('/auth/verify-otp', { state: { email } })} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200">
              Enter OTP
            </Button>
          </div>
        )}

        <div className="text-center text-sm text-slate-500 mt-6">
          <Link to="/auth/login" className="flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
