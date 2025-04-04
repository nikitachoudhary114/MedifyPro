import React, { useState } from "react";
import { specialityData } from "../assets/assets";
import DisplayDoctor from "./DisplayDoctor";

const SpecialityOption = () => {
  const [speciality, setSpeciality] = useState(""); // State to store selected specialty

  const handleSpecialityClick = (selectedSpeciality) => {
    // If the same specialty is clicked again, reset to display all doctors
    if (speciality === selectedSpeciality) {
      setSpeciality(""); // Reset to display all doctors
    } else {
      setSpeciality(selectedSpeciality); // Set the selected specialty
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-center text-3xl pt-14 mb-3 font-semibold">
          Find by Speciality
        </h1>
        <p className="text-center text-primary">
          Simply browse through our extensive list of trusted doctors, schedule
          <br />
          your appointment hassle-free.
        </p>
      </div>
      <div className="flex flex-wrap gap-8 justify-center my-14">
        {specialityData.map((doc, ind) => (
          <div
            key={ind}
            onClick={() => handleSpecialityClick(doc.speciality)} // Handle specialty selection
            className={`flex flex-col items-center cursor-pointer `} // Add a border if the specialty is selected
          >
            <img
              src={doc.image}
              alt={doc.speciality}
              className={`w-20 h-20 rounded-full mb-4 ${
                speciality === doc.speciality
                  ? "border-2 border-violet-400 rounded-full p-2"
                  : ""
              }`}
            />
            <h3 className="text-primary">{doc.speciality}</h3>
          </div>
        ))}
      </div>
      {/* Pass the selected specialty to DisplayDoctor */}
      <DisplayDoctor speciality={speciality} />
    </div>
  );
};

export default SpecialityOption;
