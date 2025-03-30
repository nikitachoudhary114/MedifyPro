import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import Appointment from "./appointment";
import { toast } from "react-toastify";
import axios from "axios";

const Dashboard = () => {
  const [category, setCategory] = useState("dashboard");
  const navigate = useNavigate();

  const changeCategory = (type) =>
    setCategory((prevCategory) =>
      prevCategory === type ? "dashboard" : type
    );

  const logout = async() => {
     try {
      const response = await axios.post(
        `http://localhost:8080/api/doctor/logout`
      );
       localStorage.removeItem("token");
       toast.success("Logout Successfully");
       navigate('/')
       
    } catch (error) {
      console.error("Error :", error);
      toast.error("Failed to Logout");
    }
   }
  return (
    <div>
      <div className="">
        <div className="flex justify-between ">
          <img src={assets.logo} alt="" className="w-44 cursor-pointer mx-10" />
          <button onClick={logout} className="my-7 mx-10 px-5 bg-[#8851f8] rounded-full text-white">
            Logout
          </button>
        </div>

        <hr className="text-gray-200" />
      </div>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="bg-[#ffffff] flex-1">
          <div>
            <div
              onClick={() => changeCategory("dashboard")}
              className={`flex gap-3 px-8 py-2 w-full hover:text-black m-2 rounded-lg hover:bg-indigo-100 hover:border-zinc-300 
              ${category === "dashboard" ? "bg-indigo-50 text-black" : ""}`}
            >
              <img src={assets.home_icon} alt="" />
              Dashboard
            </div>
          </div>
          <div
            onClick={() => changeCategory("Appointment")}
            className={`flex gap-3 px-8 py-2 w-full hover:text-black m-2 rounded-lg hover:bg-indigo-100 hover:border-zinc-300 
              ${category === "Appointment" ? "bg-indigo-50 text-black" : ""}`}
          >
            <img src={assets.appointment_icon} alt="" />
            Appointment
          </div>
          <div className="bg-[#ffffff] flex-1">
            <div
              onClick={() => changeCategory("Profile")}
              className={`flex gap-3 px-8 py-2 w-full hover:text-black m-2 rounded-lg hover:bg-indigo-100 hover:border-zinc-300 
              ${category === "Profile" ? "bg-indigo-50 text-black" : ""}`}
            >
              <img src={assets.people_icon} alt="" />
              Profile
            </div>
          </div>
        </div>

        {/* Main Content */}
        <hr />
        <div className="bg-[#f8f9fd] flex-3 min-h-screen h-full">
          {category === "Profile" && <Profile />}
          {category === "Appointment" && <Appointment />}
          {category === "dashboard" && (
            <div className="p-10">
              <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
              <p>Select a category from the sidebar to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
