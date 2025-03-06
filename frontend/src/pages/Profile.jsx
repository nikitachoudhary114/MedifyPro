import React, { useState } from "react";
import { assets } from "../assets/assets";

const Profile = () => {
  const [name, setName] = useState("Edward Vincent");
  const [email, setEmail] = useState("nikitachoudhary364@gmail.com");
  const [phone, setPhone] = useState("+91 8411014247");
  const [address1Line, setAddress1Line] = useState("57th Cross, Richmond");
  const [address2Line, setAddress2Line] = useState(
    "Circle, Church Road, London, United Kingdom - 567890"
  );
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("27 April 2005");
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="mt-14">
      <div className="flex gap-3 mb-5">
        <img className="w-40 h-40 rounded-md" src={assets.profile_pic} alt="" />
        <img className="w-40 h-40" src={assets.upload_area} alt="" />
      </div>

      <div className="mb-6">
        {/* <h2 className=""></h2> */}
        <input
          className={`outline-none text-2xl my-3 font-semibold  ${
            isEditing ? "bg-gray-50" : "bg-transparent"
          }`}
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!isEditing}
        />
        <hr className="text-slate-200 mb-3" />
        <p className="text-gray-400 underline mb-4">CONTACT INFORMATION</p>

        <div className="flex gap-16 mb-2">
          <label htmlFor="email">Email id:</label>
          <input
            className={`break-words w-3/4 outline-none ${
              isEditing ? "bg-gray-50" : "bg-transparent"
            }`}
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="flex gap-16 mb-2">
          <label htmlFor="phone">Phone:</label>
          <input
            className={`outline-none  ${
              isEditing ? "bg-gray-50" : "bg-transparent"
            }`}
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="flex gap-16 mb-2">
          <label htmlFor="address1">Address:</label>
          <div className="flex flex-col w-3/4">
            <input
              className={`outline-none ${
                isEditing ? "bg-gray-50" : "bg-transparent"
              }`}
              id="address1"
              type="text"
              value={address1Line}
              onChange={(e) => setAddress1Line(e.target.value)}
              disabled={!isEditing}
            />
            <input
              className={`outline-none w-full break-words ${
                isEditing ? "bg-gray-50" : "bg-transparent"
              }`}
              id="address2"
              type="text"
              value={address2Line}
              onChange={(e) => setAddress2Line(e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-gray-400 underline mb-5">BASIC INFORMATION</p>
        <div className="flex gap-16 mb-2">
          <label htmlFor="gender">Gender:</label>
          <input
            className={`outline-none ${
              isEditing ? "bg-gray-50" : "bg-transparent"
            }`}
            id="gender"
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="flex gap-16 mb-2">
          <label htmlFor="dob">Birthday:</label>
          <input
            className={`outline-none ${
              isEditing ? "bg-gray-50" : "bg-transparent"
            }`}
            id="dob"
            type="text"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="mt-14">
        <button
          onClick={toggleEdit}
          className="border rounded-full px-8 py-4 border-custom-bg hover:bg-slate-50 mr-5"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing ? (
          <button
            onClick={() => {
              setIsEditing(false);
              alert("Information Saved!");
            }}
            className={`border rounded-full p-4 border-custom-bg hover:bg-slate-50 ${
              !isEditing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Save Information
          </button>
        
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Profile;
