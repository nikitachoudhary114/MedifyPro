import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = ({ role, logout }) => {
  const doctorLinks = [
    { to: "/doctor/dashboard", icon: assets.home_icon, label: "Dashboard" },
    {
      to: "/appointment",
      icon: assets.appointment_icon,
      label: "Appointments",
    },
    { to: "/profile", icon: assets.people_icon, label: "Profile" },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", icon: assets.home_icon, label: "Dashboard" },
    { to: "/add-doctor", icon: assets.add_icon, label: "Add Doctor" },
    { to: "/doctor-list", icon: assets.people_icon, label: "Doctor List" },
    { to: "/patient-list", icon: assets.people_icon, label: "Patient List" },
  ];

  const links = role === "doctor" ? doctorLinks : adminLinks;

  return (
    <div className="bg-[#d0cff4] w-64 flex flex-col shadow-lg">
      {/* Logo Section */}
      <div className="flex flex-col items-center py-6">
        <img src={assets.logo} alt="Logo" className="w-32 mb-2" />
        {role === "doctor" && (
          <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
            Doctor
          </div>
        )}
        {role === "admin" && (
          <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
            Admin
          </div>
        )}
      </div>
      <hr className="border-gray-500" />

      {/* Navigation Links */}
      <div className="flex flex-col mt-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-4 mb-2 px-4 py-3 rounded-lg ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
              }`
            }
          >
            <img src={link.icon} alt={link.label} className="w-5" />
            {link.label}
          </NavLink>
        ))}
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
  );
};

export default Sidebar;
