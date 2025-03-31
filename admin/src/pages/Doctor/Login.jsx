import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/doctor/login`, {
        email,
        password,
      });
      const data = res.data;
      if (data.success) {
        toast.success("Login Success");
        localStorage.setItem("token", data.token);
        // console.log(localStorage.getItem("token"));
        navigate("doctor/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Doctor Login</h2>

        {/* <div className="mb-2 flex flex-col">
          <label htmlFor="">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="p-2 border rounded-lg mb-2"
          />
        </div> */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            // value={formData.email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        {/* <div className="mb-2 flex flex-col">
          <label htmlFor="">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded-lg mb-2"
          />
        </div> */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            // value={formData.password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-200"
          >
            Login
          </button>
        </div>
        <h2 className="text-sm py-3">
          Admin Login ?
          <span
            onClick={() => navigate("/admin")}
            className="text-blue-500 underline cursor-pointer"
          >
            Admin Login
          </span>
        </h2>
      </div>
    </div>
  );
};

export default Login;
