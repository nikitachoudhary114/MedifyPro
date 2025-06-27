import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    speciality: "",
    phone: "",
    address: "",
    fees: "",
    // image: "",
    degree: "",
    experience: "",
    about: "",
    timing: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const adminToken = localStorage.getItem("adminToken");

    // Create FormData to handle file uploads
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    const response = await axios.post(
      "https://medifypro-backend.onrender.com/api/doctor/add",
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Show success toast
    toast.success(response.data.message || "Doctor added successfully!");

    // Reset form data
    setFormData({
      name: "",
      email: "",
      password: "",
      speciality: "",
      phone: "",
      address: "",
      fees: "",
      degree: "",
      experience: "",
      about: "",
      timing: "",
      image: null,
    });
  } catch (error) {
    console.error("Error adding doctor:", error);

    // Show failure toast
    toast.error(
      error.response?.data?.message || "Failed to add doctor. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <motion.div
      className="p-6 bg-gray-100 min-h-screen flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <motion.h1
          className="text-3xl font-bold text-center text-gray-800 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Add Doctor
        </motion.h1>

        {/* Doctor Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Profile Image
            </label>
            <div
              className="cursor-pointer"
              onClick={() => document.getElementById("imageInput").click()} // Trigger file input click
            >
              <img
                src={
                  formData.image
                    ? URL.createObjectURL(formData.image) // Show preview if image is selected
                    : assets.upload_area // Show placeholder if no image is selected
                }
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border border-gray-300 shadow-md"
              />
            </div>
            <input
              type="file"
              id="imageInput"
              name="image"
              accept="image/*"
              onChange={
                (e) => setFormData({ ...formData, image: e.target.files[0] }) // Update formData with selected file
              }
              className="hidden" // Hide the file input
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter doctor's name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter doctor's email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a secure password"
              required
            />
          </div>

          {/* Speciality */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Speciality
            </label>
            <select
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Speciality</option>
              <option value="General Physician">General Physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>

          {/* Two Fields in One Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter doctor's phone number"
                required
              />
            </div>

            {/* Fees */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Fees
              </label>
              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter consultation fees"
                required
              />
            </div>
          </div>

          {/* Two Fields in One Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Degree */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Degree
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter doctor's degree"
                required
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Experience
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter years of experience"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter doctor's address"
              required
            />
          </div>

          {/* About */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write a short description about the doctor"
              rows="3"
              required
            ></textarea>
          </div>

          {/* Timing */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Timing
            </label>
            <input
              type="text"
              name="timing"
              value={formData.timing}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter available timings"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Adding Doctor..." : "Add Doctor"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddDoctor;
