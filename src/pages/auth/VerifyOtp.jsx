import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../../api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.verifyOtp(otp);
      // Navigate to reset password or dashboard
      navigate('/auth/login'); // Redirect to login for now as per typical flow
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
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={24} />
            </div>
            <span>Proedge</span>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Verify OTP</h1>
          <p className="text-slate-500">Enter the code sent to {email}</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Input 
            label="One-Time Password" 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            placeholder="123456"
            className="text-center tracking-widest text-lg"
          />
          
          <Button type="submit" isLoading={loading} className="mt-2 w-full">
            Verify & Proceed
          </Button>
        </form>

        <div className="text-center text-sm text-slate-500 mt-6">
           <Link to="/auth/login" className="flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
             <ArrowLeft size={16} /> Back to Login
           </Link>
        </div>
      </div>
    </div>
  );
};
