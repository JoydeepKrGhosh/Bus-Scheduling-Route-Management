import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ResponsiveCard = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg mx-auto my-10 w-full md:w-[80%] h-auto md:h-[400px] overflow-hidden text-black">
      
      {/* Left Content Section */}
      <motion.div
        ref={ref}
        className="w-full md:w-1/2 p-8"
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { x: '-100%', opacity: 0 },
          visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
        }}
      >
        <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
        <p className="text-lg mb-8">
          We have achieved significant milestones in our journey towards excellence.
        </p>
        
        <div className="space-y-6">
          
          {/* First Column */}
          <motion.div
            className="flex flex-col"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: '-100%' },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
            }}
          >
            <motion.div
              className="text-yellow-500 text-5xl font-bold mb-2"
              initial={{ count: 0 }}
              animate={{ count: 25 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              {({ count }) => (
                <span>{Math.round(count)}+</span>
              )}
            </motion.div>
            <h3 className="text-xl font-semibold">Projects Completed</h3>
            <p>Successfully completed over 25+ projects globally.</p>
          </motion.div>

          {/* Second Column */}
          <motion.div
            className="flex flex-col"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: '-100%' },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.4 } },
            }}
          >
            <motion.div
              className="text-yellow-500 text-5xl font-bold mb-2"
              initial={{ count: 0 }}
              animate={{ count: 97 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              {({ count }) => (
                <span>{Math.round(count)}%</span>
              )}
            </motion.div>
            <h3 className="text-xl font-semibold">Customer Satisfaction</h3>
            <p>Achieved a 97% satisfaction rate among our customers.</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Image Section */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center items-center relative"
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { x: '100%', opacity: 0 },
          visible: { x: 0, opacity: 1, transition: { duration: 0.6, delay: 0.6 } },
        }}
      >
        <div className="w-[70%] h-[70%] bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg relative shadow-lg">
          <motion.img
            src="https://via.placeholder.com/150"
            alt="Achievement"
            className="absolute top-[-20px] right-[-20px] w-full h-full object-cover"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { duration: 0.6, delay: 0.8 } }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ResponsiveCard;
