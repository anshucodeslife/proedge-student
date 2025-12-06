import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../../store/slices/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GraduationCap } from 'lucide-react';

export const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        studentId: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(signupUser(formData));
        if (signupUser.fulfilled.match(result)) {
            // Assuming successful signup, redirect to login
            navigate('/auth/login');
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
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Create Account</h1>
                    <p className="text-slate-500">Join to start learning</p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <Input
                        label="Full Name"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                    />
                    <Input
                        label="Student ID"
                        name="studentId"
                        type="text"
                        value={formData.studentId}
                        onChange={handleChange}
                        placeholder="STU-123456"
                        required
                    />
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="student@proedge.com"
                        required
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />

                    {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

                    <Button type="submit" isLoading={loading} className="mt-2 w-full">
                        Sign Up
                    </Button>

                    <div className="text-center text-sm text-slate-500 mt-2">
                        Already have an account? <Link to="/auth/login" className="text-indigo-600 font-medium hover:underline">Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
