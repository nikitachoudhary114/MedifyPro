import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const [dark, setDark] = useState(false); 
  const [token, setToken] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState(null)

  function dropdownToggle() {
    setDropdown(!dropdown);
  }
  
  useEffect(() => {
    
      const storedToken = localStorage.getItem("token");
    if (storedToken) { setToken(true); } 
  
  },[])

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      toast.success("Logout Success");
      setToken(false);
      navigate("/");
    } catch (error) {
      toast.error("Logout Failed");
    }
  }

  useEffect(() => {
    // Set the initial theme to light mode
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  function toggleTheme() {
    const newTheme = !dark;
    setDark(newTheme);
    document.documentElement.setAttribute(
      "data-theme",
      newTheme ? "dark" : "light"
    );
  }


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

  return (
    <>
      <div className="flex justify-between text-sm items-center border-b border-b-gray-400 gap-2">
        <div>
          <NavLink to="/">
            <img
              src={assets.logop}
              alt="logo"
              className="w-44 cursor-pointer"
            />
          </NavLink>
        </div>
        <div>
          <ul className="hidden md:flex md:flex-row font-medium gap-5">
            <li className="transition-all duration-700">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "p-1 border-b-2 border-b-custom-bg" : ""
                }
              >
                HOME
              </NavLink>
            </li>
            <li className="transition-all duration-700">
              <NavLink
                to="/doctors"
                className={({ isActive }) =>
                  isActive ? "p-1 border-b-2 border-b-custom-bg" : ""
                }
              >
                ALL DOCTORS
              </NavLink>
            </li>
            <li className="transition-all duration-700">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "p-1 border-b-2 border-b-custom-bg" : ""
                }
              >
                ABOUT
              </NavLink>
            </li>
            <li className="transition-all duration-700">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? "p-1 border-b-2 border-b-custom-bg" : ""
                }
              >
                CONTACT
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex gap-3 items-center">
          <div>
            {!token ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-custom-bg p-2 px-4 rounded-full text-white font-light hidden md:block"
              >
                Create Account
              </button>
            ) : (
              <div className="flex items-center gap-2 relative">
                <img
                  src={image}
                  alt=""
                  className="w-12 rounded-full"
                />
                <img
                  onClick={dropdownToggle}
                  src={assets.dropdown_icon}
                  alt=""
                />
                {dropdown ? (
                  <div className="bg-gray-100 p-4 absolute top-16 right-[0px] mt-2 w-40">
                    <Link to="/appointment">
                      <h2 className="pb-1 text-base font-normal ">
                        My Appointments
                      </h2>
                    </Link>
                    <Link to="/profile">
                      <h2 className="py-1 text-base font-normal ">
                        My Profile
                      </h2>
                    </Link>
                    <div onClick={handleLogout}>
                      <h2 className="py-1 text-base font-normal cursor-pointer ">Logout</h2>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
          <button onClick={toggleTheme}>
            {dark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
