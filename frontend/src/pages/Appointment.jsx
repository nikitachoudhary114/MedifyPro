import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
      },
    };

    const rzp = new window.Razorpay(options)
    rzp.open();
  }

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(`http://localhost:8080/api/user/payment`, { appointmentId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (data.success) {
        initPay(data.order)
      }

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
                  <button onClick={()=>appointmentRazorpay(appointment._id)} className="w-3/4 p-2 hover:bg-violet-600 bg-custom-bg text-white text-lg my-1">
                    Pay here
                  </button>
                  <button
                    onClick={() => deleteAppointment(appointment._id)}
                    className=" mt-1 border border-red-500 text-red-500 hover:bg-red-500 w-3/4 p-2 hover:text-white text-lg my-1 transition-all duration-300"
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
    </div>
  );
};

export default Appointment;
