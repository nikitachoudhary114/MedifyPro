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
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/user/profile",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const user = response.data.user;
          setName(user.name || "");
          setEmail(user.email || "");
          setPhone(user.phone || "");
          setAddress(user.address || "");
          setGender(user.gender || "");
          setDob(user.dob ? user.dob.split("T")[0] : "");
          setImage(user.image || null);
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
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("dob", dob);
      formData.append("gender", gender);
      if (image instanceof File) {
        formData.append("image", image);
      }

      const res = await axios.put(
        "http://localhost:8080/api/user/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Profile data updated successfully");
        setIsEditing(false);
        setImage(res.data.user.image);
      } else {
        toast.error("Failed to update profile data");
      }
    } catch (error) {
      console.error("Error updating profile data:", error);
      toast.error("An error occurred while updating the profile data");
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-6">
          <div
            className={`cursor-pointer ${
              isEditing ? "" : "pointer-events-none"
            }`}
            onClick={() => document.getElementById("imageInput").click()}
          >
            <img
              className="w-40 h-40 rounded-full object-cover border border-gray-300 shadow-md"
              src={
                image
                  ? image instanceof File
                    ? URL.createObjectURL(image)
                    : image
                  : assets.upload_area
              }
              alt="Profile"
            />
          </div>
          {isEditing && (
            <input
              type="file"
              id="imageInput"
              name="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
          )}
        </div>

        {/* Profile Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div className="flex flex-col items-center">
            <label htmlFor="name" className="font-semibold text-gray-700">
              Name:
            </label>
            <input
              className={`outline-none text-center w-full max-w-md ${
                isEditing ? "bg-gray-50" : "bg-transparent"
              }`}
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col items-center">
            <label htmlFor="email" className="font-semibold text-gray-700">
              Email:
            </label>
            <input
              className="outline-none text-center w-full max-w-md bg-transparent"
              id="email"
              type="text"
              value={email}
              disabled
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col items-center">
            <label htmlFor="phone" className="font-semibold text-gray-700">
              Phone:
            </label>
            <input
              className={`outline-none text-center w-full max-w-md ${
                isEditing ? "bg-gray-50" : "bg-transparent"
              }`}
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Address */}
          <div className="flex flex-col items-center">
            <label htmlFor="address" className="font-semibold text-gray-700">
              Address:
            </label>
            <input
              className={`outline-none text-center w-full max-w-md ${
                isEditing ? "bg-gray-50" : "bg-transparent"
              }`}
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col items-center">
            <label htmlFor="dob" className="font-semibold text-gray-700">
              Date of Birth:
            </label>
            <input
              className={`outline-none text-center w-full max-w-md ${
                isEditing ? "bg-gray-50" : "bg-transparent"
              }`}
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col items-center">
            <label htmlFor="gender" className="font-semibold text-gray-700">
              Gender:
            </label>
            <select
              className={`outline-none text-center w-full max-w-md ${
                isEditing ? "bg-gray-50" : "bg-transparent"
              }`}
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={!isEditing}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={toggleEdit}
            className="border rounded-full px-6 py-2 border-custom-bg hover:bg-gray-100"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button
              onClick={editProfileData}
              className="border rounded-full px-6 py-2 bg-blue-500 text-white hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
