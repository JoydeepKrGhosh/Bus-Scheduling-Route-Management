import React from "react";
import { useState, useEffect } from "react";
import { FaPhone } from 'react-icons/fa';

const BookingComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const componentPosition = document.getElementById("booking-container").getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (componentPosition < screenPosition) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      id="booking-container"
      className={`transform transition-transform duration-500 ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } w-[1170px] h-[250px] bg-white flex shadow-lg mx-auto mt-20`}
    >
      {/* Left Column */}
      <div className="w-1/3 bg-indigo-800 p-8 flex flex-col justify-center items-center text-white">
        <div className="text-3xl font-semibold">Call Now</div>
        <div className="mt-4 flex items-center">
          
        <FaPhone className="mr-3 text-2xl " />
          <span className="text-2xl"> +123 456 7890</span>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-2/3 p-8 bg-gray-100 relative">
        {/* Yellow Strip Design */}
        <div className="absolute top-0 right-0 bg-yellow-500 h-8 w-8 transform translate-x-4 -translate-y-4"></div>

        <div className="grid grid-cols-3 gap-4">
          {/* First Row */}
          <div>
            <label className="block text-gray-700">Dropdown 1</label>
            <select className="w-full p-2 mt-2 border rounded">
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Dropdown 2</label>
            <select className="w-full p-2 mt-2 border rounded">
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Date Selector</label>
            <input type="date" className="w-full p-2 mt-2 border rounded" />
          </div>

          {/* Second Row */}
          <div>
            <label className="block text-gray-700">Time Selector</label>
            <input type="time" className="w-full p-2 mt-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700">Seat Selector</label>
            <input type="number" min="1" className="w-full p-2 mt-2 border rounded" />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-indigo-800 text-white p-3 rounded mt-2">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingComponent;




















// import React from 'react';
// import { FaPhone } from 'react-icons/fa';

// const BookingComponent = () => {
//   return (
//     <div className="flex flex-col md:flex-row w-[1170px] h-[250px] bg-white shadow-lg border border-gray-300 mx-auto my-8">
//       {/* Left Side - Call Now Section */}
//       <div className="w-full md:w-1/3 bg-indigo-800 p-8 text-white relative">
//         <div className="absolute top-0 right-0 bg-yellow-500 h-8 w-8 transform translate-x-4 -translate-y-4"></div>
//         <h2 className="text-3xl font-semibold mb-4">Call Now</h2>
//         <div className="flex items-center">
//           <FaPhone className="mr-3 text-2xl" />
//           <span className="text-xl">+123 456 7890</span>
//         </div>
//       </div>

//       {/* Right Side - Online Booking Section */}
//       <div className="w-full md:w-2/3 p-8">
//         <h2 className="text-2xl font-semibold mb-6 text-left">Online Booking</h2>
//         <div className="grid grid-cols-3 gap-4 mb-4">
//           {/* First Row */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2 ">Dropdown 1</label>
//             <select className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-lg">
//               <option>Option 1</option>
//               <option>Option 2</option>
//               <option>Option 3</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Dropdown 2</label>
//             <select className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
//               <option>Option 1</option>
//               <option>Option 2</option>
//               <option>Option 3</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Date Selector</label>
//             <input
//               type="date"
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-4 mb-4">
//           {/* Second Row */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Time Selector</label>
//             <input
//               type="time"
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Seat Selector</label>
//             <input
//               type="number"
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter seat number"
//             />
//           </div>
//           <div>
//             <button className="w-full bg-indigo-600 text-white py-2 rounded-md shadow-md hover:bg-indigo-700">
//               Book Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingComponent;

