import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function LocationPopup({ isVisible, onClose }) {
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(isVisible); // Controls popup visibility

  useEffect(() => {
    if (isVisible) {
      setShowPopup(true); // Show popup when it becomes visible
      setLoading(true); // Start loading process

      // Simulate location verification process
      setTimeout(() => {
        setLoading(false); // Stop loading after 2 seconds

        // Show success message with SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Location Verified!',
          text: 'You can now proceed further.',
          confirmButtonText: 'Okay!',
          backdrop: false,
          timer: 1000, // Auto close the alert after 1 second
          timerProgressBar: true,
        }).then(() => {
          // Auto-hide the popup after success
          setTimeout(() => {
            setShowPopup(false); // Make the popup disappear
            onClose(); // Trigger the parent onClose function to restore UI
          }, 500); // Smooth transition time before popup disappears
        });
      }, 2000); // Loading time
    }
  }, [isVisible, onClose]);

  // If popup is not visible, return null to remove it from the UI
  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center transition-opacity duration-500 ease-in-out">
      {/* Popup container */}
      <div className={`p-6 rounded-xl shadow-lg w-full max-w-sm 
                      transform transition-transform duration-500 ease-in-out
                      ${isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>

        {/* Verifying Location - Deep Gradient Color */}
        {loading ? (
          <div
            className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">
              Verifying Location...
            </h2>
            <div className="flex justify-center items-center flex-col">
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-10 w-10 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8A8 8 0 014 12z"
                  ></path>
                </svg>
              </div>
              <p className="text-lg font-medium text-white mt-4">
                Please wait, verifying your location...
              </p>
            </div>
          </div>
        ) : (
          /* Success Popup - Smaller Size */
          <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-xs">
            <div className="flex justify-center items-center flex-col">
              <svg
                className="h-10 w-10 text-green-500 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m0 5a9 9 0 110-18 9 9 0 010 18z"
                />
              </svg>
              <h2 className="text-xl font-bold text-gray-700">
                Location Verified!
              </h2>
              <p className="text-sm text-gray-500">You can now proceed further.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationPopup;
