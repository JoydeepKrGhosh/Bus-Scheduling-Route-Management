import React, { useState } from 'react';

const GpsPage = () => {
  const [isGpsOn, setIsGpsOn] = useState(false);

  const handleGpsToggle = () => {
    setIsGpsOn(true);
    // Logic to show Google Maps with current location
    window.location.href = 'https://maps.google.com';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[70%] h-[70%] text-center">
        <h2 className="text-2xl font-semibold mb-6">GPS Access Required</h2>
        <button
          onClick={handleGpsToggle}
          className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white p-4 rounded-lg text-lg"
        >
          Switch on GPS
        </button>
      </div>
    </div>
  );
};

export default GpsPage;
