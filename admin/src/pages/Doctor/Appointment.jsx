import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import ChatWindow from "./ChatWindow";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[patId, setPatId] = useState();

  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
const [patientName, setPatientName] = useState("")
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const doctorId = decodedToken?.id;


  const [doctorName, setDoctorName] = useState("");



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
// setPatId(appointments.patientId)
        console.log(patientName);
        // console.log(patId)
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


  // useEffect(() => {
  //   const fetchPatientName = async () => {
  //     const response = await axios.get(
  //       `http://localhost:8080/api/user/${patientId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setPatientName(response.data.user.name);
  //     console.log(patientName)
  //   }

  //   if (patientId) {
  //     fetchPatientName();
  //   }
  // },[patientId,  token])


  useEffect(() => {
      const fetchDoctorName = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/doctor/${doctorId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setDoctorName(response.data.doctor.name);
        } catch (error) {
          // setDoctorName("Doctor");
          console.log(error)
        }
      };
  
      if (doctorId) {
        fetchDoctorName();
      }
    }, [doctorId, token]);

  const handleViewDetails = async (patientId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedPatient(response.data.user);
      
      setIsModalOpen(true);

      // console.log(selectedPatient)
    } catch (error) {
      console.error("Error fetching patient details:", error);
      toast.error("Failed to fetch patient details");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
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
                  View
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700">
                  Chat
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
                  <td className="border border-gray-300 px-6 py-3 text-center">
                    <img
                      src={assets.view}
                      className="w-7"
                      alt="view"
                      onClick={() =>
                        handleViewDetails(appointment.patientId?._id)
                      }
                    />
                  </td>
                  <td className="border border-gray-300 px-6 py-3 text-center">
                    <button
                      className="px-3 py-1  bg-blue-400 text-white rounded-full text-sm ml-2"
                      onClick={() => {
                        setSelectedChatRoom(appointment._id); // room ID
                        setPatientName(
                          appointment.patientId?.name || "Patient"
                        );
                        setPatId(appointment.patientId);
                        setShowChatModal(true);
                      }}
                    >
                      Chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Patient Details */}
      {isModalOpen && selectedPatient && (
        <div
          className="fixed inset-0  bg-opacity-100 flex items-center justify-center z-50 transition-opacity duration-300"
          style={{ animation: "fadeIn 0.3s ease-in-out" }}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-center text-[#8851f8]">
              Patient Details
            </h2>
            <table className="table-auto w-full text-left">
              <tbody>
                <tr>
                  <td className="font-semibold text-gray-700">Name:</td>
                  <td>{selectedPatient.name}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-700">Gender:</td>
                  <td>{selectedPatient.gender}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-700">DOB:</td>
                  <td>{formatDate(selectedPatient.dob)}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-700">Address:</td>
                  <td>{selectedPatient.address}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-700">
                    Medical History:
                  </td>
                  <td>{selectedPatient.medicalHistory || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showChatModal && (
        <ChatWindow
          room={selectedChatRoom}
          userId={doctorId}
          userName={doctorName}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
};

export default Appointment;
