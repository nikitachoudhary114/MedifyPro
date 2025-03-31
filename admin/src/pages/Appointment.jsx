import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decode token to get doctorId
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const doctorId = decodedToken?.id;

  // Fetch appointments for the doctor
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/appointments/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(response.data.doctorAppointments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to fetch appointments");
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId, token]);

  // Change appointment status
  const changeStatus = async (appointmentId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/appointments/${appointmentId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Appointment status updated successfully");
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status: response.data.updatedAppointment.status,
              }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" }; // Example: April 27, 2005
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#8851f8]">
        Appointments
      </h1>
      {appointments.length === 0 ? (
        <p className="text-center text-lg font-semibold text-gray-500">
          No appointments found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
            <thead className="bg-[#f8f9fd]">
              <tr>
                <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-700">
                  Patient Name
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-700">
                  Gender
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-700">
                  DOB
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-700">
                  Date
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-700">
                  Time
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-700">
                  Payment Mode
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700">
                  Actions
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700">
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-6 py-3">
                    {appointment.patientId?.name || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-6 py-3">
                    {appointment.patientId?.gender || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-6 py-3">
                    {formatDate(appointment.patientId?.dob)}
                  </td>
                  <td className="border border-gray-300 px-6 py-3">
                    {formatDate(appointment.date)}
                  </td>
                  <td className="border border-gray-300 px-6 py-3">
                    {appointment.time}
                  </td>
                  <td className="border border-gray-300 px-6 py-3 text-center">
                    <span className="px-3 py-1 bg-[#8851f8] text-white rounded-full text-sm">
                      {appointment.paymentMode}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === "Confirmed"
                          ? "bg-green-500 text-white"
                          : appointment.status === "Cancelled"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-6 py-5 flex justify-center gap-2">
                    {appointment.status !== "Confirmed" && (
                      <img
                        className="w-9 cursor-pointer"
                        onClick={() =>
                          changeStatus(appointment._id, "Confirmed")
                        }
                        src={assets.tick_icon}
                        alt="Confirm"
                        title="Confirm Appointment"
                      />
                    )}
                    {appointment.status !== "Cancelled" && (
                      <img
                        className="w-9 cursor-pointer"
                        onClick={() =>
                          changeStatus(appointment._id, "Cancelled")
                        }
                        src={assets.cancel_icon}
                        alt="Cancel"
                        title="Cancel Appointment"
                      />
                    )}
                  </td>
                  <td className="border border-gray-300 px-6 py-3 text-center">
                    <img
                      className="w-9 cursor-pointer"
                      src={assets.view}
                      alt="View"
                      title="View Details"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointment;
