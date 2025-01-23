import React, { useState } from 'react'
import { doctors } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const DisplayDoctor = ({speciality}) => {
  const [number, setNumber] = useState(10);
  const navigate = useNavigate();

  const handleCardClick = (doc) => {
    navigate(`/doctors/${doc._id}`)
  }

  return (
    <>
      <div className="flex flex-wrap justify-center items-start gap-5  ">
        {doctors.slice(0, number).map((doc, ind) => (
          <div key={ind}
            onClick={()=> handleCardClick(doc)}
            className="border border-gray-300 rounded-xl">
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
            more
          </button>
        </div>
      )}
    </>
  );
}

export default DisplayDoctor