import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check for the specific token we save during Login/Register
  const isAuthenticated = localStorage.getItem('user_token');

  // If NO token exists, kick them back to Login immediately
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, let them see the Dashboard
  return <Outlet />;
};

export default ProtectedRoute;