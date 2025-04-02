import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets, doctors } from "../assets/assets";

const DoctorInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const token = localStorage.getItem("token");

  const doctor = doctors.filter((doc) => doc._id === id)[0];
  const relatedDocs = doctors.filter(
    (doc) => doc.speciality === doctor.speciality && doc._id !== id
  );

  const handleCardClick = (doc) => {
    navigate(`/doctors/${doc._id}`);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  useEffect(() => {
    const makeAppointment = async () => {
      const response = axios.post("http://localhost:8080/api/");
    }
  })

  return (
    <div className="mt-8 px-4">
      {/* Doctor Image and Info */}
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1">
          <img
            className="w-full h-full object-cover bg-primary rounded-xl"
            src={doctor.image}
            alt={doctor.name}
          />
        </div>

        <div className="flex-1 flex flex-col border border-primary rounded-xl p-6 sm:p-8">
          <div className="flex gap-1 items-center mb-4">
            <h2 className="text-2xl font-medium">{doctor.name}</h2>
            <img
              className="w-5 h-5"
              src={assets.verified_icon}
              alt="verified_icon"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <p>{doctor.degree}</p>
            <span>-</span>
            <p>{doctor.speciality}</p>
            <button className="border px-2 py-1 border-primary rounded-xl">
              {doctor.experience}
            </button>
          </div>
          <div className="mb-4">
            <h2 className="flex gap-1 items-center font-medium">
              About
              <img src={assets.info_icon} alt="info_icon" />
            </h2>
            <p>{doctor.about}</p>
          </div>
          <div>
            <h2 className="text-lg font-medium">
              Appointment Fee: <strong>${doctor.fees}</strong>
            </h2>
          </div>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="flex justify-center items-start mt-8">
        <div className="">
          <h2 className="text-primary text-xl font-medium pb-4">
            Booking Slots
          </h2>
          {/* ----day----- */}
          <div className="flex gap-3">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
              (day, index) => (
                <button
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`border p-3 rounded-2xl border-primary ${
                    selectedDay === day ? "bg-custom-bg text-white" : ""
                  }`}
                >
                  {day} <br /> {10 + index}
                </button>
              )
            )}
          </div>
          {/* -----time------ */}
          <div className="mt-5">
            {[
              "8.00 am",
              "8.30 am",
              "9.00 am",
              "9.30 am",
              "10.00 am",
              "10.30 am",
              " 11.00 am",
            ]
              .map((time, ind) => (
                <button
                  key={ind}
                  onClick={() => handleTimeClick(time)}
                  className={`border mr-2 px-4 py-2 rounded-full border-primary ${selectedTime === time ? "bg-custom-bg text-white" : ""
                    }`}
                >
                  {time}
                </button>
              ))}
          </div>
          <button className=" my-7 w-1/2 border border-primary px-3 py-2 bg-custom-bg rounded-badge text-white text-lg transition-transform duration-300 active:scale-105">
            Book Appointment
          </button>
        </div>
      </div>

      {/* Related Doctors */}
      <div>
        <h1 className="text-3xl text-center leading-7 font-medium pt-4 mt-10">
          Related Doctors
        </h1>
        <p className="text-md font-normal leading-6 text-center py-4 mb-5">
          Simply browse through our extensive list of trusted doctors.
        </p>
        <div className="flex flex-wrap justify-center items-start gap-5 mb-40">
          {relatedDocs.map((doc) => (
            <div
              key={doc._id}
              onClick={() => handleCardClick(doc)}
              className="border border-gray-300 rounded-xl cursor-pointer"
            >
              <div className="w-56">
                <img
                  className="bg-[#eaefff] h-[60%] rounded-t-lg"
                  src={doc.image}
                  alt={doc.name}
                />
                <div className="bg-slate-100 rounded-b-lg p-3">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <h2 className="text-green-400">Available</h2>
                  </div>
                  <h2 className="text-black font-medium text-lg">{doc.name}</h2>
                  <p className="text-gray-600 text-base">{doc.speciality}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorInfo;
