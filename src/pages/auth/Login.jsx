import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../store/slices/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GraduationCap } from 'lucide-react';
import Swal from 'sweetalert2';

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
      Swal.fire({
        icon: 'success',
        title: 'Logged In!',
        text: 'Welcome back to Proedge Learning.',
        timer: 1500,
        showConfirmButton: false
      });
      navigate('/');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: result.payload || 'Invalid email or password.',
        confirmButtonColor: '#d33'
      });
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
          {/* <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h1> */}
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

          {/* Inline error removed in favor of Swal, but keeping logic just in case user wants fallback, mostly hidden by Swal now */}
          {/* {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>} */}

          <Button type="submit" isLoading={loading} className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200">
            Sign In
          </Button>

          <div className="text-center text-sm text-slate-500 mt-2">
            <Link to="/auth/forgot-password" className="text-indigo-600 font-medium hover:underline">Forgot Password?</Link>
          </div>
          <div className="text-center text-sm text-slate-500 mt-6">
            <a href="https://www.proedgelearning.in/" className="text-slate-400 hover:text-slate-600 transition-colors">← Return to Home</a>
          </div>
        </form>
      </div>
    </div>
  );
};
