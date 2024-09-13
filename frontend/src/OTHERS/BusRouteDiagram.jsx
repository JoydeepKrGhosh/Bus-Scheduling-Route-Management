import React from 'react';

const BusRouteDiagram = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Bus Route Diagram</h2>
        
        {/* SVG Route Diagram */}
        <svg
          className="border border-gray-300 rounded-lg w-full h-64"
          viewBox="0 0 400 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Draw stops as circles */}
          <circle className="stop" cx="50" cy="50" r="8" fill="red" stroke="black" strokeWidth="2" />
          <circle className="stop" cx="150" cy="50" r="8" fill="red" stroke="black" strokeWidth="2" />
          <circle className="stop" cx="250" cy="50" r="8" fill="red" stroke="black" strokeWidth="2" />
          <circle className="stop" cx="350" cy="50" r="8" fill="red" stroke="black" strokeWidth="2" />

          {/* Draw route line */}
          <line className="line" x1="50" y1="50" x2="350" y2="50" stroke="blue" strokeWidth="4" />

          {/* Add stop labels */}
          <text x="45" y="70" className="text-xs">Stop 1</text>
          <text x="145" y="70" className="text-xs">Stop 2</text>
          <text x="245" y="70" className="text-xs">Stop 3</text>
          <text x="345" y="70" className="text-xs">Stop 4</text>
        </svg>
        
        <p className="mt-4 text-center text-gray-600">This is a simple bus route diagram with 4 stops.</p>
      </div>
    </div>
  );
};

export default BusRouteDiagram;
