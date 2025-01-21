import React, { useEffect, useState } from "react";
import { specialityData } from "../assets/assets";
import DisplayDoctor from "./DisplayDoctor";


const SpecialityOption = () => {
    const [speciality, setSpeciality] = useState("");
    const setData = (data) => {
        setSpeciality(data)
        
    }
     useEffect(() => {
       console.log(speciality); 
     }, [speciality]);
    
  return (
    <div>
      <div>
        <h1 className="text-center text-3xl pt-14 mb-3 font-semibold">
          Find by Speciality
        </h1>
        <p className="text-center text-primary ">
          Simply browse through our extensive list of trusted doctors, schedule{" "}
          <br />
          your appointment hassle-free.
        </p>
      </div>
      <div className="flex flex-wrap gap-8 justify-center my-14">
        {specialityData.map((doc, ind) => (
          <div
            onClick={() => setData(doc.speciality)}
            key={ind}
            className="flex flex-col  items-center"
          >
            <img
              src={doc.image}
              alt={doc.speciality}
              className="w-20 h-20 rounded-full mb-4"
            />
            <h3 className="text-primary">{doc.speciality}</h3>
          </div>
        ))}
          </div>
          <DisplayDoctor speciality={speciality} />
    </div>
  );
};

export default SpecialityOption;
