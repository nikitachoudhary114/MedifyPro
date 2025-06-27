import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Profile = () => {
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false); // For availability toggle
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  }); // For password update

  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const doctorId = decodedToken?.id;

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!doctorId) {
        console.error("Doctor ID not found in token");
        return;
      }

      try {
        const response = await axios.get(
          `https://medifypro-backend.onrender.com/api/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDoctor(response.data.doctor);
        setFormData(response.data.doctor);
        setIsAvailable(response.data.doctor.availability);
        // Set availability
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
        toast.error(error)
      }
    };

    fetchDoctorProfile();
  }, [doctorId, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://medifypro-backend.onrender.com/api/doctor/${doctorId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDoctor(response.data.doctor);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://medifypro-backend.onrender.com/api/doctor/${doctorId}/update-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" }); // Clear the form
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password.");
    }
  };

  const toggleAvailability = async () => {
    try {
      const response = await axios.post(
        `https://medifypro-backend.onrender.com/api/doctor/${doctorId}/available`,
        { isAvailable: !isAvailable },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsAvailable(response.data.isAvailable);
      toast.success(
        `Availability updated to ${
          response.data.isAvailable ? "Available" : "Not Available"
        }`
      );
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability.");
    }
  };

  if (!doctor) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <motion.h1
        className="text-3xl font-bold mb-8 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Doctor Profile
      </motion.h1>

      {!isEditing ? (
        <motion.div
          className="bg-white shadow-md rounded-lg p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <img
              src={doctor.image || "https://via.placeholder.com/150"}
              alt="Doctor"
              className="w-32 h-32 rounded-full object-cover mr-6"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-700">
                {doctor.name}
              </h2>
              <div className="flex items-center mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={toggleAvailability}
                    className="h-5 w-5 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {isAvailable ? "Available" : "Not Available"}
                  </span>
                </label>
              </div>
            </div>
          </div>
          <table className="table-auto w-full text-left border-collapse">
            <tbody>
              <tr>
                <td className="font-semibold text-gray-700 border px-4 py-2">
                  Email:
                </td>
                <td className="border px-4 py-2">{doctor.email}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 border px-4 py-2">
                  Speciality:
                </td>
                <td className="border px-4 py-2">{doctor.speciality}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 border px-4 py-2">
                  Phone:
                </td>
                <td className="border px-4 py-2">{doctor.phone}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 border px-4 py-2">
                  Address:
                </td>
                <td className="border px-4 py-2">{doctor.address}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 border px-4 py-2">
                  Fees:
                </td>
                <td className="border px-4 py-2">{doctor.fees}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 border px-4 py-2">
                  Degree:
                </td>
                <td className="border px-4 py-2">{doctor.degree}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 border px-4 py-2">
                  Experience:
                </td>
                <td className="border px-4 py-2">{doctor.experience}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 border px-4 py-2">
                  About:
                </td>
                <td className="border px-4 py-2">{doctor.about}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 border px-4 py-2">
                  Timing:
                </td>
                <td className="border px-4 py-2">{doctor.timing}</td>
              </tr>
            </tbody>
          </table>

          <button
            className="mt-5 px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-200"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </motion.div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-gray-700 font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Speciality:
            </label>
            <input
              type="text"
              name="speciality"
              value={formData.speciality || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              Address:
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Fees:</label>
            <input
              type="number"
              name="fees"
              value={formData.fees || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Degree:</label>
            <input
              type="text"
              name="degree"
              value={formData.degree || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              Experience:
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">About:</label>
            <textarea
              name="about"
              value={formData.about || ""}
              onChange={handleChange}
              className="border p-2 peer h-full min-h-[100px] w-full resize-none  rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Timing:</label>
            <input
              type="text"
              name="timing"
              value={formData.timing || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-200"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Password Update Section */}
      <motion.div
        className="bg-white shadow-md rounded-lg p-6 mt-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Update Password
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">
              Current Password:
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              New Password:
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-200"
          >
            Update Password
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
