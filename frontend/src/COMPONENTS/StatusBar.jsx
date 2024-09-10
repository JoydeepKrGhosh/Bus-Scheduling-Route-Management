import React from 'react';

export default function StatusBar() {
  return (
    <div className="bg-[#28293E] text-white p-4 flex justify-between">
      <span>Current Location: Delhi</span>
      <span>ETA to Destination: 30 mins</span>
      <button className="bg-blue-500 p-2 rounded">Refresh</button>
    </div>
  );
}
