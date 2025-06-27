import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);



const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.post(
          "https://medifypro-backend.onrender.com/api/admin/adminDashboard"
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
    totalDoctors,
    totalPatients,
    totalAppointments,
    doctorsBySpeciality,
    appointmentsByMonth,
    highestAppointmentDoctors,
  } = dashboardData;

  const doctorImagePlugin = {
    id: "doctorImagePlugin",
    afterDatasetsDraw: (chart) => {
      const { ctx, chartArea, scales } = chart;
      const barHeight =
        (chartArea.bottom - chartArea.top) / highestAppointmentDoctors.length;

      highestAppointmentDoctors.forEach((doctor, index) => {
        const image = new Image();
        image.src = doctor.image; // Assuming `doctor.image` contains the image URL
        const imageSize = 40; // Increase image size to 40x40
        const x = chartArea.left - imageSize - 10; // Position image slightly to the left of the bar
        const y =
          chartArea.top + index * barHeight + barHeight / 2 - imageSize / 2; // Center image vertically

        image.onload = () => {
          ctx.drawImage(image, x, y, imageSize, imageSize); // Draw image with updated size
        };
      });
    },
  };
  // Array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Data for Appointments by Month (Bar Chart)
  const appointmentsByMonthData = {
    labels: appointmentsByMonth.map((item) => monthNames[item._id - 1]), // Map numeric month to month name
    datasets: [
      {
        label: "Appointments",
        data: appointmentsByMonth.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Data for Doctors by Speciality (Pie Chart)
  const doctorsBySpecialityData = {
    labels: doctorsBySpeciality.map((item) => item._id),
    datasets: [
      {
        data: doctorsBySpeciality.map((item) => item.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  // Data for Highest Appointment Doctors (Horizontal Bar Chart)
  const highestAppointmentDoctorsData = {
    labels: highestAppointmentDoctors.map((item) => item.doctor),
    datasets: [
      {
        label: "Appointments",
        data: highestAppointmentDoctors.map((item) => item.appointmentCount),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="text-4xl font-bold text-indigo-500 mr-4">
            {totalDoctors}
          </div>
          <span className="text-lg font-semibold text-gray-700">Doctors</span>
        </div>
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="text-4xl font-bold text-green-500 mr-4">
            {totalPatients}
          </div>
          <span className="text-lg font-semibold text-gray-700">Patients</span>
        </div>
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="text-4xl font-bold text-yellow-500 mr-4">
            {totalAppointments}
          </div>
          <span className="text-lg font-semibold text-gray-700">
            Appointments
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Appointments by Month */}
        <div className="bg-white shadow rounded-lg p-6 ">
          <h2 className="text-2xl italic text-center font-bold text-gray-600 mb-10">
            Appointments by Month
          </h2>
          <Bar
            data={appointmentsByMonthData}
            options={{ responsive: true, animation: { duration: 1000 } }}
          />
        </div>

        {/* Doctors by Speciality */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl italic text-center font-bold text-gray-600 mb-6">
            Doctors by Speciality
          </h2>
          <Pie
            data={doctorsBySpecialityData}
            options={{ responsive: true, animation: { duration: 1000 } }}
          />
        </div>

        {/* Highest Appointment Doctors */}
        <div className="col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl italic text-center font-bold text-gray-600 mb-6">
            Highest Appointment Doctors
          </h2>

          <Bar
            data={{
              labels: highestAppointmentDoctors.map(
                (doctor) => ` ${doctor.doctor} (${doctor._id}) `
              ),
              datasets: [
                {
                  label: "Appointments",
                  data: highestAppointmentDoctors.map(
                    (doctor) => doctor.appointmentCount
                  ),
                  backgroundColor: "rgba(255, 99, 132, 0.6)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              indexAxis: "y", // Horizontal Bar Chart
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const doctor =
                        highestAppointmentDoctors[context.dataIndex];
                      return `${doctor.doctor}: ${doctor.appointmentCount} appointments`;
                    },
                    // afterLabel: function (context) {
                    //   const doctor = highestAppointmentDoctors[context.dataIndex];
                    //     return doctor.image
                    //   ? `Image: `
                    //   : "No image available";
                    // },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
