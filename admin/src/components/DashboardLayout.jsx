import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post(`http://localhost:8080/api/doctor/logout`);
      localStorage.removeItem("token");
      toast.success("Logout Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-[#d0cff4] w-64 flex flex-col shadow-lg">
        {/* Logo Section */}
        <div className="flex flex-col items-center py-6">
          <img src={assets.logo} alt="Logo" className="w-32 mb-2" />
          <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
            Doctor
          </div>
        </div>
        <hr className="border-gray-500" />

        {/* Navigation Links */}
        <div className="flex flex-col mt-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 mx-4 mb-2 px-4 py-3 rounded-lg ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
              }`
            }
          >
            <img src={assets.home_icon} alt="Dashboard" className="w-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/appointment"
            className={({ isActive }) =>
              `flex items-center gap-3 mx-4 mb-2 px-4 py-3 rounded-lg ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
              }`
            }
          >
            <img
              src={assets.appointment_icon}
              alt="Appointments"
              className="w-5"
            />
            Appointments
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 mx-4 mb-2 px-4 py-3 rounded-lg ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
              }`
            }
          >
            <img src={assets.people_icon} alt="Profile" className="w-5" />
            Profile
          </NavLink>
        </div>

        {/* Logout Button */}
        <div className="mt-auto p-4">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#f8f9fd] p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
