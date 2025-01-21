import React, { useEffect, useState } from 'react'
import { doctors, specialityData } from '../assets/assets'

const Doctors = () => {
  const [category, setCategory] = useState('all');
  const changeCategory = (speciality ) => (
    setCategory((prevCategory) => prevCategory === speciality ? 'all' : speciality)
  )
  useEffect(() => {
    console.log(category)
  }), [category]
  
  const filteredDoctors = category === 'all' ? doctors : doctors.filter((doctor)=> doctor.speciality === category)

  return (
    <>
      <h2 className="pt-5">Browse through the doctors specialist.</h2>
      <div className="flex md:flex-row flex-col gap-4  ">
        <div className="sm:min-h-screen min-h-32  flex flex-col gap-3 md:mt-6 mt-3 lg:w-64 md:w-44 sm:w-16">
          <button
            onClick={() => changeCategory("General physician")}
            className="px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300"
          >
            General physician
          </button>
          <button
            onClick={() => changeCategory("Gynecologist")}
            className="px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300"
          >
            Gynecologist
          </button>
          <button
            onClick={() => changeCategory("Dermatologist")}
            className="px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300"
          >
            Dermatologist
          </button>
          <button
            onClick={() => changeCategory("")}
            className="px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300"
          >
            Pediatricians
          </button>
          <button
            onClick={() => changeCategory("Neurologist")}
            className="px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300"
          >
            Neurologist
          </button>
          <button
            onClick={() => changeCategory("Gastroenterologist")}
            className="px-8 py-2 hover:text-black border rounded-lg hover:bg-indigo-100 hover:border-zinc-300"
          >
            Gastroenterologist
          </button>
        </div>
        <div className="justify-start ">
          <div className="flex flex-wrap justify-center mt-8 mx-auto items-start gap-5  ">
            {filteredDoctors.map((doc, ind) => (
            
              <div key={ind} className="border border-gray-300 rounded-xl">
                
                <div className="w-48 ">
                  <img
                    className="bg-[#eaefff] h-[60%] rounded-t-lg"
                    src={doc.image}
                    alt=""
                  />

                  <div className="bg-slate-100 rounded-b-lg p-2">
                    <div className="flex gap-2 items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <h2 className="text-green-400">Available</h2>
                    </div>
                    <h2 className="text-black font-medium text-lg">
                      {doc.name}
                    </h2>
                    <p className="text-gray-600 text-base">{doc.speciality}</p>
                  </div>
                </div>
               
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Doctors