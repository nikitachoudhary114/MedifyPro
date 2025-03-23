import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [isEditing, setIsEditing] = useState(false);

 
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/profile", {
         
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });

       if (response.data.success) {
         const user = response.data.user;
         setName(user.name || "");
         setEmail(user.email || "");
         setPhone(user.phone || "");
         setAddress(user.address?.split(",")[0] || "");
         setGender(user.gender || "");
         setDob(user.dob || "");
       } else {
         toast.error("Failed to load profile data");
       }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("An error occurred while fetching the profile data");
      }
    };

    fetchProfileData();
  }, []);



  const editProfileData = async () => {
    try {
      const res = await axios.put("http://localhost:8080/api/user/profile", {
        name,
        email,
        phone,
        address,
        dob,
        gender
      }
      , {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        });
      
      if (res.data.success) {
        toast.success("Profile data updated successfully");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile data");
        
      }
    } catch (error) {
      console.error("Error updating profile data:", error);
      toast.error("An error occurred while updating the profile data");
      
    }
  }

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="mt-14">
      <div className="flex gap-3 mb-5">
        <img className="w-40 h-40 rounded-md" src={assets.profile_pic} alt="" />
        <img className="w-40 h-40" src={assets.upload_area} alt="" />
      </div>

      <div className="mb-6">
        <input
          className={`outline-none text-2xl my-3 font-semibold ${
            isEditing ? "bg-gray-50" : "bg-transparent"
          }`}
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!isEditing}
        />
        <hr className="text-slate-200 mb-3" />
        <p className="text-gray-400 underline mb-4">CONTACT INFORMATION</p>

        <div className="flex gap-16 mb-2">
          <label htmlFor="email">Email id:</label>
          <input
            className={`break-words w-3/4 outline-none ${
              isEditing ? "bg-gray-50" : "bg-transparent"
            }`}
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="flex gap-16 mb-2">
          <label htmlFor="phone">Phone:</label>
          <input
            className={`outline-none ${
              isEditing ? "bg-gray-50" : "bg-transparent"
            }`}
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="flex gap-16 mb-2">
          <label htmlFor="address1">Address:</label>
          <div className="flex flex-col w-3/4">
            <input
              className={`outline-none ${
                isEditing ? "bg-gray-50" : "bg-transparent"
              }`}
              id="address1"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isEditing}
            />
          
          </div>
        </div>
      </div>

      <div>
        <p className="text-gray-400 underline mb-5">BASIC INFORMATION</p>
        <div className="flex gap-16 mb-2">
          <label htmlFor="gender">Gender:</label>
          <input
            className={`outline-none ${
              isEditing ? "bg-gray-50" : "bg-transparent"
            }`}
            id="gender"
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="flex gap-16 mb-2">
          <label htmlFor="dob">Birthday:</label>
          <input
            className={`outline-none ${
              isEditing ? "bg-gray-50" : "bg-transparent"
            }`}
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="mt-14">
        <button
          onClick={toggleEdit}
          className="border rounded-full px-8 py-4 border-custom-bg hover:bg-slate-50 mr-5"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing && (
          <button
            onClick={() => {
              editProfileData();
            }}
            className="border rounded-full p-4 border-custom-bg hover:bg-slate-50"
          >
            Save Information
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
