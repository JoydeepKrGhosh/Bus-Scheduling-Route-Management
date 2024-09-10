import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const ResponsiveSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div className="bg-white py-12 px-4 md:px-8 text-black">
      <div
        ref={ref}
        className={`flex flex-col md:flex-row items-center justify-between transition-all duration-700 ease-in-out`}
      >
        {/* Left Section */}
        <div
          className={`md:w-1/2 w-full mb-8 md:mb-0 p-4 transition-opacity duration-700 ease-in-out ${
            inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-50px]'
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">Main Heading</h2>
          <p className="text-lg mb-8">This is a paragraph providing some context about the content.</p>

          {/* Sub-Columns */}
          <div className="flex flex-col gap-8">
            <div
              className={`transition-transform duration-700 ease-in-out ${
                inView ? 'translate-x-0 opacity-100' : 'translate-x-[-50px] opacity-0'
              }`}
            >
              <CountUp
                start={0}
                end={25}
                duration={2}
                suffix="+"
                className="text-yellow-400 text-4xl font-bold"
              />
              <h3 className="text-xl font-semibold mt-2">Sub-Heading 1</h3>
              <p className="text-md">This is a small paragraph related to the first sub-column.</p>
            </div>

            <div
              className={`transition-transform duration-700 ease-in-out delay-300 ${
                inView ? 'translate-x-0 opacity-100' : 'translate-x-[-50px] opacity-0'
              }`}
            >
              <CountUp
                start={0}
                end={97}
                duration={2}
                suffix="%"
                className="text-yellow-400 text-4xl font-bold"
              />
              <h3 className="text-xl font-semibold mt-2">Sub-Heading 2</h3>
              <p className="text-md">This is a small paragraph related to the second sub-column.</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div
          className={`md:w-1/2 w-full p-4 flex justify-center items-center transition-all duration-700 ease-in-out ${
            inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[50px]'
          }`}
        >
          <div className="relative w-[70%] h-[70%] bg-gradient-to-r from-purple-500 to-blue-500 flex justify-center items-center">
            {inView && (
              <img
                src="https://via.placeholder.com/150"
                alt="Placeholder"
                className="absolute right-[-20px] top-[-20px] w-full h-full object-cover transition-all duration-500"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveSection;
