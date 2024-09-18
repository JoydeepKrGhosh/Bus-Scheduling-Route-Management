import React from 'react';

export default function RouteDetailsPanel() {
  return (
    <div className="bg-[#28293E] w-4/4 p-4 text-white h-full">
      <h2 className="text-lg font-bold mb-4">Route: DTC-101</h2>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span>Stop 1: Connaught Place</span>
          <span>ETA: 10 mins</span>
        </li>
        <li className="flex justify-between text-gray-500">
          <span>Stop 2: Janpath (Completed)</span>
        </li>
        <li className="flex justify-between">
          <span>Stop 3: India Gate</span>
          <span>ETA: 20 mins</span>
        </li>
      </ul>
      <button className="mt-6 bg-blue-500 px-4 py-2 rounded">View All Stops</button>
    </div>
  );
}
