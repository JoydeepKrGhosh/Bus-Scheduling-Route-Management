import React from 'react';

export default function ControlButtons() {
  return (
    <div className="flex justify-center space-x-4 my-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Start Navigation</button>
      <button className="bg-gray-600 text-white px-4 py-2 rounded">Pause Navigation</button>
      <button className="bg-red-500 text-white px-4 py-2 rounded">End Navigation</button>
    </div>
  );
}
