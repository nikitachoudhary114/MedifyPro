import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className=" mt-44">
      <div className="flex flex-col md:flex-row gap-32 border-b pb-8 border-b-gray-200 px-6">
        {/* Left Section */}
        <div>
          <img src={assets.logo} alt="logo" className="max-w-44" />
          <p className="mt-6 text-base font-normal text-gray-600 leading-7">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, illo
            illum. Sed aperiam commodi ut unde temporibus, dolorem laborum culpa
            voluptatem nulla consectetur vero alias fuga vitae animi, illum
            consequatur.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <h2 className="text-xl font-semibold mb-6 text-gray-700">COMPANY</h2>
          <p className="py-1 text-base text-gray-600 hover:text-gray-900 cursor-pointer">
            Home
          </p>
          <p className="py-1 text-base text-gray-600 hover:text-gray-900 cursor-pointer">
            About Us
          </p>
          <p className="py-1 text-base text-gray-600 hover:text-gray-900 cursor-pointer">
            Contact Us
          </p>
          <p className="py-1 text-base text-gray-600 hover:text-gray-900 cursor-pointer">
            Privacy Policy
          </p>
        </div>

        {/* Right Section */}
        <div>
          <h2 className="text-xl font-semibold mb-6 text-gray-700">
            GET IN TOUCH
          </h2>
          <p className="py-1 text-base text-gray-600 hover:text-gray-900 cursor-pointer">
            +91-84110-14247
          </p>
          <p className="py-1 text-base text-gray-600 hover:text-gray-900 cursor-pointer">
            nikitachoudhary364@gmail.com
          </p>
        </div>
      </div>
      <h2 className="text-gray-600 text-center my-4">
        Copyright &copy; 2025 Made with &#x2764; by Nikita
      </h2>
    </div>
  );
};

export default Footer;
