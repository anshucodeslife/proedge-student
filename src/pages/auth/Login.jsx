import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../store/slices/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

export const Login = () => {
  const [email, setEmail] = useState('student2@proedge.com');
  const [password, setPassword] = useState('student123');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-orange-600 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10 relative z-10 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 font-bold text-2xl">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <img src="/proedge_logo.png" alt="Proedge" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center gap-1 leading-none">
              <span className="tracking-tight text-orange-500">Proedge</span>
              <span className="tracking-tight text-slate-800">Learning</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-slate-600 text-sm">Sign in to continue learning</p>
        </div>

        {/* Form */}
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

          <Button
            type="submit"
            isLoading={loading}
            className="mt-2 w-full bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            Sign In
          </Button>

          <div className="text-center text-sm text-slate-500 mt-2">
            <Link to="/auth/forgot-password" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className="text-center text-sm text-slate-500 mt-4">
            <a
              href="https://www.proedgelearning.in/"
              className="text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              Return to Home
            </a>
          </div>
        </form>
      </div>

      {/* Footer Text */}
      <div className="mt-8 text-center text-white/80 text-sm">
        <p>© 2025 ProEdge Learning. All rights reserved.</p>
      </div>
    </div>
  );
};
