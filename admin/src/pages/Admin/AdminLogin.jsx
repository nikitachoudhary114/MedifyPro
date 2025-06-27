import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Redirect based on token presence
  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      navigate("/admin/dashboard"); // Redirect to admin dashboard
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://medifypro-backend.onrender.com/api/admin/login",
        formData
      );
      localStorage.setItem("adminToken", response.data.token);
      toast.success("Admin Login successful");
      navigate("/admin/dashboard"); // Redirect to admin dashboard
    } catch (error) {
      console.error("Error logging in admin:", error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-200"
          >
            Login
          </button>

          <h2 className="text-sm py-3">
            Doctor Login ?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-blue-500 underline cursor-pointer"
            >
              Doctor Login
            </span>
          </h2>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
