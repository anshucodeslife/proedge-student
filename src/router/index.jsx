import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { VerifyOtp } from '../pages/auth/VerifyOtp';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { EnrolledCourses } from '../pages/dashboard/EnrolledCourses';
import { CourseDetails } from '../pages/dashboard/CourseDetails';
import { LessonPlayer } from '../pages/dashboard/LessonPlayer';
import { Attendance } from '../pages/dashboard/Attendance';
import { Notifications } from '../pages/dashboard/Notifications';
import { Profile } from '../pages/dashboard/Profile';
import { useSelector } from 'react-redux';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector(state => state.auth);
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

export const router = createBrowserRouter([
  {
    path: '/auth/login',
    element: <Login />
  },
  {
    path: '/auth/signup',
    element: <Signup />
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/auth/verify-otp',
    element: <VerifyOtp />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'courses',
        element: <EnrolledCourses />
      },
      {
        path: 'courses/:courseId',
        element: <CourseDetails />
      },
      {
        path: 'courses/:courseId/learn',
        element: <LessonPlayer />
      },
      {
        path: 'attendance',
        element: <Attendance />
      },
      {
        path: 'notifications',
        element: <Notifications />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  }
]);
