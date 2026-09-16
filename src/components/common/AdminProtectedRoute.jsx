import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminProtectedRoute() {
  const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
