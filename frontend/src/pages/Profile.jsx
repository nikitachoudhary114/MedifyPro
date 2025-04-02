import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  
  const [image, setImage] = useState(null); // State for profile image
  const [isEditing, setIsEditing] = useState(false);
const [loading, setLoading] = useState(false);  

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/user/profile",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const user = response.data.user;
          setName(user.name || "");
          setEmail(user.email || "");
          setPhone(user.phone || "");
          setAddress(user.address || "");
          setGender(user.gender || "");
          setDob(user.dob ? user.dob.split("T")[0] : ""); // Format DOB for input
          setImage(user.image || null); // Load existing profile image
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("An error occurred while fetching the profile data");
      }
    };

    fetchProfileData();
  }, []);

const editProfileData = async () => {
  try {
    setLoading(true); // Start loading
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("dob", dob);
    formData.append("gender", gender);
    if (image instanceof File) {
      formData.append("image", image); // Append the selected image
    }

    const res = await axios.put(
      "http://localhost:8080/api/user/profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (res.data.success) {
      toast.success("Profile data updated successfully");
      setIsEditing(false);
      setImage(res.data.user.image); // Update image with the saved URL
    } else {
      toast.error("Failed to update profile data");
    }
  } catch (error) {
    console.error("Error updating profile data:", error);
    toast.error("An error occurred while updating the profile data");
  } finally {
    setLoading(false); // End loading
  }
};

  const toggleEdit = () => setIsEditing(!isEditing);

 return (
   <div className="mt-14">
     {/* Profile Image Section */}
     <div className="flex gap-3 mb-5">
       <div
         className={`cursor-pointer ${isEditing ? "" : "pointer-events-none"}`}
         onClick={() => document.getElementById("imageInput").click()} // Trigger file input click
       >
         <img
           className="w-40 h-40 rounded-md object-cover border border-gray-300 shadow-md"
           src={
             image
               ? image instanceof File
                 ? URL.createObjectURL(image) // Show preview if a new image is selected
                 : image // Show existing profile image
               : assets.upload_area // Show placeholder if no image is available
           }
           alt="Profile"
         />
       </div>
       {isEditing && (
         <input
           type="file"
           id="imageInput"
           name="image"
           accept="image/*"
           onChange={(e) => setImage(e.target.files[0])} // Update image state
           className="hidden" // Hide the file input
         />
       )}
     </div>

     {/* Profile Fields */}
     <div className="mb-6">
       {/* Name */}
       <div className="flex gap-16 mb-2">
         <label htmlFor="name" className="font-semibold text-gray-700">
           Name:
         </label>
         <input
           className={`outline-none w-3/4 ${
             isEditing ? "bg-gray-50" : "bg-transparent"
           }`}
           id="name"
           type="text"
           value={name}
           onChange={(e) => setName(e.target.value)}
           disabled={!isEditing}
         />
       </div>

       {/* Email (Non-editable) */}
       <div className="flex gap-16 mb-2">
         <label htmlFor="email" className="font-semibold text-gray-700">
           Email:
         </label>
         <input
           className="outline-none w-3/4 bg-transparent"
           id="email"
           type="text"
           value={email}
           disabled // Email is non-editable
         />
       </div>

       <div className="flex gap-16 mb-2">
         <label htmlFor="address" className="font-semibold text-gray-700">
           Phone
         </label>
         <input
           className={`outline-none w-3/4 ${
             isEditing ? "bg-gray-50" : "bg-transparent"
           }`}
           id="address"
           type="text"
           value={phone}
           onChange={(e) => setPhone(e.target.value)}
           disabled={!isEditing}
         />
       </div>


       {/* Address */}
       <div className="flex gap-16 mb-2">
         <label htmlFor="address" className="font-semibold text-gray-700">
           Address:
         </label>
         <input
           className={`outline-none w-3/4 ${
             isEditing ? "bg-gray-50" : "bg-transparent"
           }`}
           id="address"
           type="text"
           value={address}
           onChange={(e) => setAddress(e.target.value)}
           disabled={!isEditing}
         />
       </div>

       {/* Date of Birth */}
       <div className="flex gap-16 mb-2">
         <label htmlFor="dob" className="font-semibold text-gray-700">
           Date of Birth:
         </label>
         <input
           className={`outline-none w-3/4 ${
             isEditing ? "bg-gray-50" : "bg-transparent"
           }`}
           id="dob"
           type="date"
           value={dob}
           onChange={(e) => setDob(e.target.value)}
           disabled={!isEditing}
         />
       </div>

       {/* Gender */}
       <div className="flex gap-16 mb-2">
         <label htmlFor="gender" className="font-semibold text-gray-700">
           Gender:
         </label>
         <select
           className={`outline-none w-3/4 ${
             isEditing ? "bg-gray-50" : "bg-transparent"
           }`}
           id="gender"
           value={gender}
           onChange={(e) => setGender(e.target.value)}
           disabled={!isEditing}
         >
           <option value="">Select Gender</option>
           <option value="Male">Male</option>
           <option value="Female">Female</option>
           <option value="Other">Other</option>
         </select>
       </div>
     </div>

     {/* Action Buttons */}
     <div className="mt-14">
       <button
         onClick={toggleEdit}
         className="border rounded-full px-8 py-4 border-custom-bg hover:bg-slate-50 mr-5"
       >
         {isEditing ? "Cancel" : "Edit"}
       </button>
       {isEditing && (
         <button
           onClick={editProfileData}
           className="border rounded-full p-4 border-custom-bg hover:bg-slate-50"
           disabled={loading} // Disable the button while saving
         >
           {loading ? "Saving..." : "Save Information"}
         </button>
       )}
     </div>
   </div>
 );
};

export default Profile;
