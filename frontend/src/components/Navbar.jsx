import React from 'react'
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <div className="flex justify-between text-sm items-center py-4 border-b border-b-gray-400 gap-2">
        <div>
          <NavLink to="/">
            <img src={assets.logo} alt="logo" className="w-44 cursor-pointer" />
          </NavLink>
        </div>
        <div>
          <ul className="hidden md:flex md:flex-row font-medium gap-5">
            <li className="transition-all duration-700">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "p-1 border-b-2 border-b-custom-bg " : ""
                }
              >
                HOME
              </NavLink>
            </li>
            <li className="transition-all duration-700">
              <NavLink
                to="/doctors"
                className={({ isActive }) =>
                  isActive ? "p-1 border-b-2 border-b-custom-bg " : ""
                }
              >
                ALL DOCTORS
              </NavLink>
            </li>
            <li className="transition-all duration-700">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "p-1 border-b-2 border-b-custom-bg " : ""
                }
              >
                ABOUT
              </NavLink>
            </li>
            <li className="transition-all duration-700">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? "p-1 border-b-2 border-b-custom-bg " : ""
                }
              >
                CONTACT
              </NavLink>
            </li>
          </ul>
        </div>
        <div>
          <button className="bg-custom-bg p-2 px-4 rounded-full text-white font-light hidden md:block">
            Create Account
          </button>
        </div>
      </div>
      
    </>
  );
}

export default Navbar