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
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="shadow-xl p-8 rounded-xl w-96">
        <h2 className="text-primary font-medium text-xl">Doctor Login</h2>
       
        <div className="mb-2 flex flex-col">
          <label htmlFor="">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="p-2 border rounded-lg mb-2"
          />
        </div>
        <div className="mb-2 flex flex-col">
          <label htmlFor="">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded-lg mb-2"
          />
        </div>
        <div>
          <button
            onClick={handleLogin}
            className="w-full py-2 mb-3 bg-[#8851f8] rounded-lg text-white"
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
