import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../store/slices/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GraduationCap } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('student@proedge.com');
  const [password, setPassword] = useState('password');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
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
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-slate-500">Sign in to continue learning</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="student@proedge.com"
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
          />
          
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

          <Button type="submit" isLoading={loading} className="mt-2 w-full">
            Sign In
          </Button>
          
          <div className="text-center text-sm text-slate-500 mt-2">
             <Link to="/auth/forgot-password" className="text-indigo-600 font-medium hover:underline">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
