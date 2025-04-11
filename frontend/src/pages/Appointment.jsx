import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch appointments for the user
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/appointments/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.patientAppointments) {
        setAppointments(response.data.patientAppointments);
        console.log(appointments);
      } else {
        toast.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.log("Error fetching appointments:", error);
      toast.error("An error occurred while fetching appointments.");
    } finally {
      setLoading(false);
    }
  };

  // Delete an appointment
  const deleteAppointment = async (appointmentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/appointments/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        toast.success(response.data.message);
        // Remove the deleted appointment from the UI
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment._id !== appointmentId
          )
        );
      } else {
        toast.error("Failed to delete appointment");
      }
    } catch (error) {
      console.log("Error deleting appointment:", error);
      toast.error("An error occurred while deleting the appointment.");
    }
  };

  // Add a review for a doctor
  const submitReview = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/doctor/${selectedDoctorId}/review`,
        { review, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        toast.success(response.data.message);
        setShowReviewModal(false);
        setReview("");
        setRating(0);
      } else {
        toast.error("Failed to add review");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while adding the review.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const initPay = (order) => {
    const options = {
      key: "rzp_test_VuXL9xKSfucJ3D",
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "payment for the appointment of patient with doctor",
      order_id: order.id,
      recipt: order.recipt,
      handler: async (response) => {
        console.log(response);

        try {
          const { data } = await axios.post(
            `http://localhost:8080/api/user/verify`,
            response,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (data.success) {
            fetchAppointments();
            navigate("/appointment");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `http://localhost:8080/api/user/payment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        initPay(data.order);
      }
      // console.log(data)
    } catch (error) {
      console.log("Error in payment of appointment:", error);
      toast.error("An error occurred while payment of appointment.");
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl p-3 mt-14 font-semibold">My Appointments</h2>
      <hr />
      <div>
        {appointments.length === 0 ? (
          <p className="text-center mt-6">No Appointments found.</p>
        ) : (
          appointments.map((appointment, ind) => (
            <div key={ind}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 my-6">
                <div className="flex">
                  <div>
                    <img
                      src={appointment.doctorId.image}
                      className="w-44 bg-[#eaefff] mx-4"
                      alt="Doctor"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">
                      {appointment.doctorId.name}
                    </h2>
                    <h2 className="mb-3">{appointment.doctorId.speciality}</h2>
                    <p className="text-blue-800 mb-1">
                      Fees: &#x20B9;{appointment.doctorId.fees}
                    </p>
                    <p className="text-gray-600 font-medium">
                      Date: {new Date(appointment.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 font-medium">
                      Time: {appointment.time}
                    </p>
                  </div>
                </div>
                <div>
                  {appointment.payment ? (
                    <>
                      <button
                        className="w-3/4 p-2 bg-slate-200 text-gray-700 text-lg my-1"
                        onClick={() => {
                          setSelectedDoctorId(appointment.doctorId._id);
                          setShowReviewModal(true);
                        }}
                      >
                        Add Review
                      </button>
                    </>
                  ) : (
                    <button
                      className="w-3/4 p-2 hover:bg-violet-600 bg-custom-bg text-white text-lg my-1"
                      onClick={() => appointmentRazorpay(appointment._id)}
                    >
                      Pay here
                    </button>
                  )}
                  <button
                    onClick={() => deleteAppointment(appointment._id)}
                    className="mt-1 border border-red-500 text-red-500 hover:bg-red-500 w-3/4 p-2 hover:text-white text-lg my-1 transition-all duration-300"
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
              <hr />
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Review</h2>
            <textarea
              className="w-full p-2 border rounded mb-4"
              rows="4"
              placeholder="Write your review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
            <select
              className="w-full p-2 border rounded mb-4"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value={0}>Select Rating</option>
              <option value={1}>1 - Poor</option>
              <option value={2}>2 - Fair</option>
              <option value={3}>3 - Good</option>
              <option value={4}>4 - Very Good</option>
              <option value={5}>5 - Excellent</option>
            </select>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded mr-2"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={submitReview}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
