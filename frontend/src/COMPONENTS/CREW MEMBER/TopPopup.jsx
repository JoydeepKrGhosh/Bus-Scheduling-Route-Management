import React, { useEffect, useState } from 'react';

const TopPopup = ({ message, isVisible, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false); // Control to ensure animation happens once per popup open

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      // Reset loading and success states when popup is triggered
      setIsLoading(true);
      setHasAnimated(true); // Ensure animation runs only once per trigger

      // Simulate loading animation (1.5 seconds), then show the checkmark
      setTimeout(() => setIsLoading(false), 1500);

      // Automatically close the popup after 3 seconds
      setTimeout(() => {
        onClose();
        setHasAnimated(false); // Reset the animation state for next trigger
      }, 3000);
    }
  }, [isVisible, hasAnimated, onClose]);

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          {/* Popup */}
          <div
            className={`fixed top-0 left-0 right-0 flex items-start justify-center transition-transform duration-500 ease-in-out ${
              isVisible ? 'translate-y-16' : '-translate-y-full'
            } z-50`}
          >
            <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96 h-64 mt-16 flex flex-col items-center justify-center relative">
              {isLoading ? (
                <div className="flex flex-col items-center">
                  {/* Loading spinner */}
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                  <p className="mt-4 text-lg font-semibold text-gray-700">Verifying Image...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {/* Success checkmark */}
                  <svg
                    className="h-16 w-16 text-green-500 mb-4 animate-bounce"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <h1 className="text-2xl font-bold text-gray-900">{message}</h1>
                  <p className="text-green-600 font-semibold mt-2">You can now proceed further</p>
                </div>
              )}

              {/* Close button */}
              <button
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                onClick={onClose}
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopPopup;
