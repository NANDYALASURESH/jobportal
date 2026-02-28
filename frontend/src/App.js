import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import ProtectedRoute from './components/Common/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobsList from './pages/JobsList';
import JobDetail from './pages/JobDetail';
import MyApplications from './pages/MyApplications';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminJobs from './pages/Admin/AdminJobs';
import JobForm from './pages/Admin/JobForm';
import AdminApplications from './pages/Admin/AdminApplications';

import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* User Protected */}
          <Route path="/my-applications" element={
            <ProtectedRoute requiredRole="User">
              <MyApplications />
            </ProtectedRoute>
          } />

          {/* Admin Protected */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/jobs" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminJobs />
            </ProtectedRoute>
          } />
          <Route path="/admin/jobs/create" element={
            <ProtectedRoute requiredRole="Admin">
              <JobForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/jobs/edit/:id" element={
            <ProtectedRoute requiredRole="Admin">
              <JobForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminApplications />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
