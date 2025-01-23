import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [dark, setDark] = useState(false); // Default to light mode
  const navigate = useNavigate();
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
        <div className="flex gap-2">
          <div>
            <button onClick={()=> navigate('/login')} className="bg-custom-bg p-2 px-4 rounded-full text-white font-light hidden md:block">
              Create Account
            </button>
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
