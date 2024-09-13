import React, { useEffect, useState } from 'react';

const BusRouteAnimation = () => {
  const stops = ['stop1', 'stop2', 'stop3', 'stop4'];
  const [activeStop, setActiveStop] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStop((prevStop) => (prevStop + 1) % stops.length);
    }, 2000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="flex justify-between m-12"> {/* Margin adjusted to match your 50px */}
      {stops.map((stop, index) => (
        <div
          key={stop}
          className={`w-5 h-5 rounded-full transition-colors duration-1000 ${
            activeStop === index ? 'bg-red-500' : 'bg-gray-500'
          }`}
        ></div>
      ))}
    </div>
  );
};

export default BusRouteAnimation;
