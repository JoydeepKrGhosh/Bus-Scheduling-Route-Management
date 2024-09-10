import React from "react";
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaFacebook, FaInstagram, FaGithub, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full h-[300px] bg-indigo-900 text-white flex flex-col justify-center items-center">
      <div className="w-full max-w-[1170px] flex justify-between items-start gap-8">
        
        {/* Column 1 */}
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <FaPhone className="text-3xl mr-2" />
            <h2 className="text-2xl font-bold">Company Name</h2>
          </div>
          <p className="mt-4 text-sm w-[300px]">
            We are a customer-oriented company providing the best services in the industry. Contact us for more information.
          </p>
          <button className="mt-4 flex items-center bg-yellow-500 hover:bg-indigo-600 py-2 px-4 rounded">
            <FaPhone className="mr-2" /> +123 456 7890
          </button>
        </div>

        {/* Column 2 */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Company</h2>
          <ul className="space-y-2">
            <li>About Us</li>
            <li>Leadership</li>
            <li>Careers</li>
            <li>Article & News</li>
            <li>Legal Notice</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Services</h2>
          <ul className="space-y-2">
            <li>Safety Guarantee</li>
            <li>Schedule on Time</li>
            <li>Online Booking</li>
            <li>Professional Staffs</li>
            <li>FAQs and Support</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Company Name</h2>
          <div className="flex items-center">
          
            <FaMapMarkerAlt className="mr-2 text-xl" />
            <span>Jl Cempaka Wangi No 22 Jakarta - Indonesia</span>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="mr-2 text-xl" />
            <span>email@example.com</span>
          </div>
          <div className="flex items-center">
            <FaPhone className="mr-2 text-xl" />
            <span>+123 456 7890</span>
          </div>
          <div className="flex items-center">
            <span>FOLLOW US :- </span>
            <div className="ml-2 flex space-x-4">
              <FaFacebook className="hover:animate-bounce cursor-pointer" />
              <FaInstagram className="hover:animate-bounce cursor-pointer" />
              <FaGithub className="hover:animate-bounce  cursor-pointer" />
              <FaTwitter className="hover:animate-bounce cursor-pointer" />
              <FaYoutube className="hover:animate-bounce cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="w-full border-t border-gray-400 mt-8"></div>

      {/* Bottom Text */}
      <div className="w-full max-w-[1170px] flex justify-between items-center mt-4 px-4">
        <span>&copy; 2024 Company Name. All Rights Reserved.</span>
        <span>Privacy <span className="text-yellow-500">|</span> Terms <span className="text-yellow-500">|</span> Conditions</span>
      </div>
    </footer>
  );
};

export default Footer;
