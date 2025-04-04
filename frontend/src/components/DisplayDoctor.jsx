import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DisplayDoctor = ({ speciality }) => {
  const [number, setNumber] = useState(10); // Number of doctors to display
  const [doctors, setDoctors] = useState([]); // State to store doctors
  const [loading, setLoading] = useState(true); // Loading state

  const navigate = useNavigate();

  const handleCardClick = (doc) => {
    navigate(`/doctors/${doc._id}`);
  };


  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8080/api/doctor/all",
          {
            headers: {
           
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
            
            params: speciality ? { speciality } : {}, // Pass speciality only if specified
          }
        );

        setDoctors(response.data.data || []); // Update doctors state
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [speciality]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (doctors.length === 0) {
    return <div>No doctors found for the selected specialty.</div>;
  }

  return (
    <>
      <div className="flex flex-wrap justify-center items-start gap-5">
        {doctors.slice(0, number).map((doc, ind) => (
          <div
            key={ind}
            onClick={() => handleCardClick(doc)}
            className="border border-gray-300 rounded-xl"
          >
            <div className="w-48">
              <img
                className="bg-[#eaefff] h-[60%] rounded-t-lg"
                src={doc.image}
                alt={doc.name}
              />
              <div className="bg-slate-100 rounded-b-lg p-2">
                <div className="flex gap-2 items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      doc.availability ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  <h2
                    className={`text-${doc.availability ? "green" : "red"}-400`}
                  >
                    {doc.availability ? "Available" : "Not Available"}
                  </h2>
                </div>
                <h2 className="text-black font-medium text-lg">{doc.name}</h2>
                <p className="text-gray-600 text-base">{doc.speciality}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {number < doctors.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setNumber(doctors.length)}
            className="bg-gray-300 rounded-full px-8 py-2 text-gray-800 hover:bg-slate-300 cursor-pointer"
          >
            More
          </button>
        </div>
      )}
    </>
  );
};

export default DisplayDoctor;
