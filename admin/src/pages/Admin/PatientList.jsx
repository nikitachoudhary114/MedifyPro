import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null); // For viewing specific patient details
  const [loading, setLoading] = useState(true);

  // Get admin token from localStorage
  const adminToken = localStorage.getItem("adminToken");

  // Axios instance with authorization header
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:8080/api/user/"
      );
      setPatients(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients.");
      setLoading(false);
    }
  };

  // Fetch specific patient details
  const fetchPatientDetails = async (userId) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:8080/api/user/${userId}`
      );
      setSelectedPatient(response.data.user);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      toast.error("Failed to fetch patient details.");
    }
  };

  // Delete a patient
  const deletePatient = async (userId) => {
    try {
      await axiosInstance.delete(`http://localhost:8080/api/user/${userId}`);
      toast.success("Patient deleted successfully.");
      setPatients(patients.filter((patient) => patient._id !== userId)); // Remove from UI
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Failed to delete patient.");
    }
  };

  useEffect(() => {
    fetchPatients();
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
        Patient List
      </motion.h1>

      {/* Patient Table */}
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
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <motion.tr
                key={patient._id}
                className="hover:bg-gray-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="border px-4 py-2">{patient.name}</td>
                <td className="border px-4 py-2">{patient.email}</td>
                <td className="border px-4 py-2">{patient.phone || "N/A"}</td>
                <td className="border-t-0  border-l-0 border px-4 py-2 flex space-x-4 justify-center">
                  {/* View Button */}
                  <div
                    onClick={() => fetchPatientDetails(patient._id)}
                    className="cursor-pointer hover:scale-110 transition-transform duration-200"
                    title="View Patient Details"
                  >
                    <img
                      src={assets.view}
                      alt="View Patient"
                      className="w-6 h-6 object-contain"
                    />
                  </div>

                  {/* Delete Button */}
                  <div
                    onClick={() => deletePatient(patient._id)}
                    className="cursor-pointer hover:scale-110 transition-transform duration-200"
                    title="Delete Patient"
                  >
                    <img
                      src={assets.delete_icon}
                      alt="Delete Patient"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Patient Details Modal */}
      {selectedPatient && (
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
              onClick={() => setSelectedPatient(null)}
            >
              ✕
            </button>

            {/* Modal Header */}
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Patient Details
            </h2>

            {/* Patient Image */}
            <div className="flex justify-center mb-6">
              <img
                src={selectedPatient.image || "https://via.placeholder.com/150"}
                alt="Patient"
                className="w-32 h-32 rounded-full object-cover shadow-md"
              />
            </div>

            {/* Patient Details Table */}
            <table className="table-auto w-full text-left border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Name:
                  </td>
                  <td className="px-4 py-2">{selectedPatient.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Email:
                  </td>
                  <td className="px-4 py-2">{selectedPatient.email}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Phone:
                  </td>
                  <td className="px-4 py-2">
                    {selectedPatient.phone || "N/A"}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Address:
                  </td>
                  <td className="px-4 py-2">
                    {selectedPatient.address || "N/A"}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    Gender:
                  </td>
                  <td className="px-4 py-2">
                    {selectedPatient.gender || "N/A"}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-700 px-4 py-2">
                    DOB:
                  </td>
                  <td className="px-4 py-2">
                    {selectedPatient.dob
                      ? new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(new Date(selectedPatient.dob))
                      : "N/A"}
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

export default PatientList;
