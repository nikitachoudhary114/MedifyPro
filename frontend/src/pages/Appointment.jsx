import React from "react";
import { doctors } from "../assets/assets";

const Appointment = () => {
  return (
    <div>
      <h2 className="text-xl p-3 mt-14 font-semibold ">My Appointments</h2>
      <hr />
      <div>
        {doctors.slice(0, 3).map((doc, ind) => (
          <div key={ind}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 my-6">
              <div className="flex">
                <div>
                  <img
                    src={doc.image}
                    className="w-44 bg-[#eaefff] mx-4"
                    alt=""
                  />
                </div>

                <div >
                  <h2 className="text-xl font-semibold">{doc.name}</h2>
                  <h2 className="mb-3">{doc.speciality}</h2>
                  <p className="text-lg font-medium text-gray-600 mb-1">Address:</p>
                  <p className="text-primary">{doc.address.line1}</p>
                  <p className="mb-3 text-primary">{doc.address.line2}</p>
                  <p className="text-gray-600 font-medium ">Date & Time: 28 Jan,2025</p>
                </div>
              </div>
              <div>
                <button className="w-3/4 p-2 hover:bg-violet-600 bg-custom-bg text-white text-lg my-2 ">
                  Pay here
                </button>
                <button className=" border hover:bg-slate-100 w-3/4 p-2 text-primary text-lg my-2">
                  Cancel Appointment
                </button>
              </div>
            </div>
            <hr />
          </div>
        ))}
        <div></div>
      </div>
    </div>
  );
};

export default Appointment;
