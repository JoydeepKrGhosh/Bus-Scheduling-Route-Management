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
    <div className="flex flex-wrap justify-center gap-4 p-4 md:p-6 lg:p-8">
      {stops.map((stop, index) => (
        <div
          key={stop}
          className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full transition-colors duration-1000 ${activeStop === index ? 'bg-red-500' : 'bg-gray-500'
            }`}
        ></div>
      ))}
    </div>
  );
};

export default BusRouteAnimation;
