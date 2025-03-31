import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/Doctor/Login'; // Ensure the path and file name are correct
import AdminLogin from './pages/Admin/AdminLogin';
// import Dashboard from './pages/Doctor/DoctorDashboard';
// import Appointment from './pages/doctor/appointment';
import Profile from './pages/Doctor/Profile';
import DashboardLayout from './components/DashboardLayout';
// import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import Appointment from './pages/Doctor/Appointment';
import DoctorList from './pages/Admin/DoctorList';
import AddDoctor from './pages/Admin/AddDoctor';
import PatientList from './pages/Admin/PatientList';
function App() {
  

  return (
    <>
      <div className="flex flex-col min-h-screen ">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected Routes */}
          <Route element={<DashboardLayout />}>
            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/doctor-list" element={<DoctorList />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/patient-list" element={<PatientList />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App
