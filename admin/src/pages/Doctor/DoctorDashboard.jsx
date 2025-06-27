import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the doctor token is stored in localStorage
        const response = await axios.post(
          "https://medifypro-backend.onrender.com/api/admin/doctorDashboard",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching doctor dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const {
    totalAppointments,
    totalRevenue,
    latestAppointments,
    revenueByMonth = [], // Fallback to an empty array if undefined
  } = dashboardData;

  // Map numeric months to month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Data for Revenue by Month (Bar Chart)
  const revenueByMonthData = {
    labels: revenueByMonth.map((item) => monthNames[item._id - 1] || "Unknown"), // Map numeric month to month name
    datasets: [
      {
        label: "Revenue",
        data: revenueByMonth.map((item) => item.totalFees || 0), // Fallback to 0 if totalFees is undefined
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Doctor Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="flex items-center p-6 bg-white shadow-lg rounded-lg transform transition duration-300 hover:scale-105">
          <div className="text-4xl font-bold text-indigo-500 mr-4">
            {totalAppointments}
          </div>
          <span className="text-lg font-semibold text-gray-700">
            Total Appointments
          </span>
        </div>
        <div className="flex items-center p-6 bg-white shadow-lg rounded-lg transform transition duration-300 hover:scale-105">
          <div className="text-4xl font-bold text-green-500 mr-4">
            ₹{totalRevenue}
          </div>
          <span className="text-lg font-semibold text-gray-700">
            Total Revenue
          </span>
        </div>
      </div>

      {/* Charts */}
      <div
        className="bg-white shadow-lg rounded-lg p-6 mb-8 pb-12 transform transition duration-300 hover:scale-105"
        style={{ height: "420px" }} // Set custom height for the chart container
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Revenue by Month
        </h2>
        
        <Bar
          data={revenueByMonthData}
          options={{
            responsive: true,
            maintainAspectRatio: false, // Allow custom height
            animation: { duration: 1000 },
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
          }}
        />
      </div>

      {/* Latest Appointments Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Latest Appointments
        </h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Patient Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Appointment Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Fees
              </th>
            </tr>
          </thead>
          <tbody>
            {latestAppointments.map((appointment, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition duration-200`}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.patientId ? appointment.patientId.name : "NA"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(appointment.date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ₹{appointment.doctorId.fees}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;
