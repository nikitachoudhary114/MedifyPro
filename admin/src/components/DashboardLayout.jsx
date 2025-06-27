import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const DashboardLayout = () => {
  const [role, setRole] = useState(null); // Role: 'doctor' or 'admin'
  const navigate = useNavigate();

  useEffect(() => {

    if (localStorage.getItem("token")) {
      setRole("doctor");
    } else if (localStorage.getItem("adminToken")) {
      setRole("admin");
    }
  }, [navigate]);

  const logout = async () => {
    try {
      if (role === "doctor") {
        await axios.post(
          `https://medifypro-backend.onrender.com/api/doctor/logout`
        );

        localStorage.removeItem("token");
         toast.success("Logout Successfully");
        navigate("/");
      } else if (role === "admin") {
        await axios.post(
          `https://medifypro-backend.onrender.com/api/admin/logout`
        );
        localStorage.removeItem("adminToken");
 toast.success("Logout Successfully");
        navigate("/");
      }
     
      
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar role={role} logout={logout} />

      {/* Main Content */}
      <div className="flex-1 bg-[#f8f9fd] p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
