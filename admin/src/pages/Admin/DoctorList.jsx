import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // For viewing specific doctor details
  const [loading, setLoading] = useState(true);

  // Get admin token from localStorage
  const adminToken = localStorage.getItem("adminToken");

  // Axios instance with authorization header
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:8080/api/doctor/all"
      );
      setDoctors(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to fetch doctors.");
      setLoading(false);
    }
  };

  // Fetch specific doctor details
  const fetchDoctorDetails = async (doctorId) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:8080/api/doctor/${doctorId}`
      );
        setSelectedDoctor(response.data.doctor);
        console.log(selectedDoctor)
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      toast.error("Failed to fetch doctor details.");
    }
  };

  // Delete a doctor
  const deleteDoctor = async (doctorId) => {
    try {
      await axiosInstance.delete(
        `http://localhost:8080/api/doctor/${doctorId}`
      );
      toast.success("Doctor deleted successfully.");
      setDoctors(doctors.filter((doctor) => doctor._id !== doctorId)); // Remove from UI
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast.error("Failed to delete doctor.");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="p-5">
      <motion.h1
        className="text-3xl font-bold mb-8 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Doctor List
      </motion.h1>

      {/* Doctor Table */}
      <motion.div
        className="overflow-x-auto bg-white shadow-md rounded-lg p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Speciality</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <motion.tr
                key={doctor._id}
                className="hover:bg-gray-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="border px-4 py-2">{doctor.name}</td>
                <td className="border px-4 py-2">{doctor.email}</td>
                <td className="border px-4 py-2">{doctor.speciality}</td>
                <td className="border px-4 py-2 flex space-x-4 justify-center">
                  {/* View Button */}
                  <div
                    onClick={() => fetchDoctorDetails(doctor._id)}
                    className="cursor-pointer hover:scale-110 transition-transform duration-200"
                    title="View Doctor Details"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="blue"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 9V5.25m0 0L12 9m3.75-3.75L18 9m-6 6v3.75m0 0L8.25 15m3.75 3.75L15.75 15"
                      />
                    </svg>
                  </div>

                  {/* Delete Button */}
                  <div
                    onClick={() => deleteDoctor(doctor._id)}
                    className="cursor-pointer hover:scale-110 transition-transform duration-200"
                    title="Delete Doctor"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="red"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <motion.div
          className="fixed inset-0 bg-gray-100 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedDoctor(null)}
            >
              ✕
            </button>

            {/* Modal Header */}
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Doctor Details
            </h2>
            <div className="flex justify-center mb-6">
              <img
                src={selectedDoctor.image }
                // alt="Patient"
                className="w-32 h-32 rounded-full object-cover shadow-md"
              />
            </div>

            {/* Doctor Details Table */}
            <table className="table-auto w-full text-left border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Name:
                  </td>
                  <td className="px-4 py-2">{selectedDoctor.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Availability:
                  </td>
                  <td className="px-4 py-2">
                    {selectedDoctor.availability
                      ? "Available"
                      : "Not Available"}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Email:
                  </td>
                  <td className="px-4 py-2">{selectedDoctor.email}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Speciality:
                  </td>
                  <td className="px-4 py-2">{selectedDoctor.speciality}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Experience:
                  </td>
                  <td className="px-4 py-2">{selectedDoctor.experience}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Degree:
                  </td>
                  <td className="px-4 py-2">{selectedDoctor.degree}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Phone:
                  </td>
                  <td className="px-4 py-2">{selectedDoctor.phone || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Address:
                  </td>
                  <td className="px-4 py-2">
                    {selectedDoctor.address || "N/A"}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Fees:
                  </td>
                  <td className="px-4 py-2">{selectedDoctor.fees || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    About:
                  </td>
                  <td className="px-4 py-2">{selectedDoctor.about || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Timings:
                  </td>
                  <td className="px-4 py-2">
                    {selectedDoctor.timing || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorList;
