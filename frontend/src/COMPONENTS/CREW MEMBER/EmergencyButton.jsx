import React from 'react';

export default function EmergencyButton() {
  return (
    <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8">
      <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
        Emergency Help
      </button>
    </div>
  );
}
