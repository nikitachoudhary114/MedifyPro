import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/Login'; // Ensure the path and file name are correct
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Appointment from './pages/appointment';
import Profile from './pages/Profile';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
function App() {
  

  return (
    <>
      <div className="flex flex-col min-h-screen ">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected Routes with Dashboard Layout */}
          <Route
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App
