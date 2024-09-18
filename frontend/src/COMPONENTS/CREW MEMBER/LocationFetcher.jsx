import React, { useState } from 'react';

function LocationFetcher({ onComplete }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Latitude: ", position.coords.latitude);
          console.log("Longitude: ", position.coords.longitude);
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            onComplete(); // Notify parent that location is fetched
          }, 3000); // Hide popup after 3 seconds
        },
        (error) => {
          console.error("Error fetching location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="flex items-center mt-4">
      <button
        onClick={handleGetLocation}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Get Current Location
      </button>

      {showPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
          Location successfully fetched!
        </div>
      )}
    </div>
  );
}

export default LocationFetcher;

