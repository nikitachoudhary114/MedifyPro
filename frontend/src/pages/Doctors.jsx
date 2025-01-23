import React, { useEffect, useState } from 'react'
import { doctors, specialityData } from '../assets/assets'
import { useNavigate } from 'react-router-dom';

const Doctors = () => {
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();
  
  const changeCategory = (speciality ) => (
    setCategory((prevCategory) => prevCategory === speciality ? 'all' : speciality)
  )


    const handleCardClick = (doc) => {
      navigate(`/doctors/${doc._id}`);
  };
  

  // useEffect(() => {
  //   console.log(category)
  // }), [category]
  
  const filteredDoctors = category === 'all' ? doctors : doctors.filter((doctor)=> doctor.speciality === category)

  return (
    <>
      <h2 className="pt-5">Browse through the doctors specialist.</h2>
      <div className="flex md:flex-row flex-col gap-4  ">
        <div className="sm:min-h-screen min-h-32  flex flex-col gap-3 md:mt-6 mt-3 lg:w-64 md:w-44 sm:w-16">
          <button
            onClick={() => changeCategory("General physician")}
            className={` px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300 
              ${
                category === "General physician"
                  ? "bg-indigo-50 text-black"
                  : ""
              }`}
          >
            General physician
          </button>
          <button
            onClick={() => changeCategory("Gynecologist")}
            className={`px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300 ${
              category === "Gynecologist" ? "bg-indigo-50  text-black" : ""
            }`}
          >
            Gynecologist
          </button>
          <button
            onClick={() => changeCategory("Dermatologist")}
            className={`px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300
               ${
                 category === "Dermatologist" ? "bg-indigo-50  text-black" : ""
               }`}
          >
            Dermatologist
          </button>
          <button
            onClick={() => changeCategory("")}
            className={`px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300
               ${
                 category === "Pediatricians" ? "bg-indigo-50  text-black" : ""
               }`}
          >
            Pediatricians
          </button>
          <button
            onClick={() => changeCategory("Neurologist")}
            className={`px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300
               ${category === "Neurologist" ? "bg-indigo-50  text-black" : ""}`}
          >
            Neurologist
          </button>
          <button
            onClick={() => changeCategory("Gastroenterologist")}
            className={`px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300
               ${
                 category === "Gastroenterologist"
                   ? "bg-indigo-50  text-black"
                   : ""
               }`}
          >
            Gastroenterologist
          </button>
        </div>
        <div className=" ">
          {filteredDoctors.length === 0 ? (
            <h2 className="p-10 text-2xl text-red-400 mx-auto text-center">
              No Doctors Available now
            </h2>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8 mx-auto items-start">
              {filteredDoctors.map((doc, ind) => (
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
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <h2 className="text-green-400">Available</h2>
                      </div>
                      <h2 className="text-black font-medium text-lg">
                        {doc.name}
                      </h2>
                      <p className="text-gray-600 text-base">
                        {doc.speciality}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Doctors