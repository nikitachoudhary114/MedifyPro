import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Use named import for jwt-decode
import { toast } from "react-toastify";

const Profile = () => {
  const [doctor, setDoctor] = useState(null); // Initialize as null
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Decode the token to get the doctorId
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const doctorId = decodedToken?.id; // Assuming the token payload contains `id` for doctorId

  // Fetch doctor profile
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!doctorId) {
        console.error("Doctor ID not found in token");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token for authentication
            },
          }
        );
        setDoctor(response.data.doctor);
        setFormData(response.data.doctor); // Pre-fill the form with fetched data
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };

    fetchDoctorProfile();
  }, [doctorId, token]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for updating profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8080/api/doctor/${doctorId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        }
      );
      setDoctor(response.data.doctor);
      setIsEditing(false); // Exit editing mode
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  // Render loading state if doctor data is not yet available
  if (!doctor) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#8851f8]">
        Doctor Profile
      </h1>

      {!isEditing ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong className="text-gray-700">Name:</strong> {doctor.name}
            </p>
            <p>
              <strong className="text-gray-700">Email:</strong> {doctor.email}
            </p>
            <p>
              <strong className="text-gray-700">Speciality:</strong>{" "}
              {doctor.speciality}
            </p>
            <p>
              <strong className="text-gray-700">Phone:</strong> {doctor.phone}
            </p>
            <p>
              <strong className="text-gray-700">Address:</strong>{" "}
              {doctor.address}
            </p>
            <p>
              <strong className="text-gray-700">Fees:</strong> {doctor.fees}
            </p>
            <p>
              <strong className="text-gray-700">Degree:</strong> {doctor.degree}
            </p>
            <p>
              <strong className="text-gray-700">Experience:</strong>{" "}
              {doctor.experience}
            </p>
            <p className="col-span-2">
              <strong className="text-gray-700">About:</strong> {doctor.about}
            </p>
            <p className="col-span-2">
              <strong className="text-gray-700">Timing:</strong> {doctor.timing}
            </p>
          </div>
          <button
            className="mt-5 px-6 py-2 bg-violet-500 text-white rounded hover:bg-violet-600"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
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
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
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
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
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
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Fees:</label>
            <input
              type="number"
              name="fees"
              value={formData.fees || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Degree:</label>
            <input
              type="text"
              name="degree"
              value={formData.degree || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
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
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">About:</label>
            <textarea
              name="about"
              value={formData.about || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Timing:</label>
            <input
              type="text"
              name="timing"
              value={formData.timing || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-violet-500 text-white rounded hover:bg-green-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;

