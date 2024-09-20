// src/components/Notification.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Notification = ({ darkMode, handleCardClick }) => {
  return (
    <div
      className={`max-w-4xl mx-auto p-6 mt-16 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      } shadow-lg rounded-lg transition-all duration-300 ease-in-out mb-8`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-4">Important Notification</h2>
        <button
          onClick={() => handleCardClick('dashboard')}
          className="text-xl text-gray-500 hover:text-red-500 transition-colors"
        >
          <FaTimes />
        </button>
      </div>

      <p className="text-lg">
        Please note that the schedule for tomorrow has been updated. Ensure to check your routes and timings by the end of the day. Contact the admin for any clarifications.
      </p>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => handleCardClick('viewDetails')}
          className={`px-6 py-3 text-lg font-semibold rounded-lg ${
            darkMode
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-indigo-600 text-white hover:bg-indigo-500'
          } transition`}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Notification;
