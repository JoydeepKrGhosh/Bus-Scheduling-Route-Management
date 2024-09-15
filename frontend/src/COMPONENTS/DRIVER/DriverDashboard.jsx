// import React from 'react';
// import { FaBus, FaMapMarkerAlt, FaBell } from 'react-icons/fa';
// import Sidebar from './Sidebar';

// function CrewMemberDashboard() {
//   return (
//     <div className="flex">
//       <Sidebar role="Crew Member" />
//       <div className="flex-grow p-6 bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg">
//         <h1 className="text-3xl font-bold mb-6">Crew Member Dashboard</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
//             <FaBus className="text-blue-500 text-3xl mr-4" />
//             <div>
//               <p className="text-xl font-semibold">My Schedule</p>
//               <p className="text-gray-500">View and manage your assigned shifts.</p>
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
//             <FaMapMarkerAlt className="text-green-500 text-3xl mr-4" />
//             <div>
//               <p className="text-xl font-semibold">Route Map</p>
//               <p className="text-gray-500">View your assigned routes on the map.</p>
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
//             <FaBell className="text-red-500 text-3xl mr-4" />
//             <div>
//               <p className="text-xl font-semibold">Notifications</p>
//               <p className="text-gray-500">View system notifications.</p>
//             </div>
//           </div>
//           <div className="mt-8">
//              <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
//              <ul>
//                <li className="mb-2">
//                  <span className="font-semibold">Schedule updated</span> at 10:00 AM.
//                </li>
//                <li className="mb-2">
//                  <span className="font-semibold">Route assigned</span> at 09:30 AM.
//                </li>
//               <li>
//                 <span className="font-semibold">Checked in</span> at 08:00 AM.
//                </li>
//              </ul>
//           </div>
//         </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CrewMemberDashboard;


///////////////////////////////////////////////////////////////

// CrewMemberDashboard.jsx
import React, { useState, useRef } from 'react';
import { FaBus, FaMapMarkerAlt, FaBell, FaWindowMaximize, FaWindowMinimize } from 'react-icons/fa';
import Webcam from 'react-webcam';
import Sidebar from '../UTILITIES/Sidebar';
import Navbar from '../UTILITIES/Navbar';
import GISNavigation from './GISNavigation';
import MySchedule from './MySchedule'; 

function DriverDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeComponent, setActiveComponent] = useState('Dashboard');
  const [isDayStarted, setIsDayStarted] = useState(false);
  const [isEndDayEnabled, setIsEndDayEnabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [history, setHistory] = useState([]);
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isImageCaptured, setIsImageCaptured] = useState(false);

  const webcamRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleStartDay = () => {
    setIsDayStarted(true);
    setIsEndDayEnabled(true);
    setShowWebcam(true);
  };

  const handleEndDay = () => {
    setIsEndDayEnabled(false);
    clearInterval(intervalId);
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);
    const seconds = timer % 60;
    const formattedTime = `${hours}h ${minutes}m ${seconds}s`;

    setHistory((prevHistory) => [...prevHistory, `Day lasted for: ${formattedTime}`]);
    setTimer(0);
    setIsDayStarted(false);
    setIsImageCaptured(false); 
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowWebcam(false);
    setIsImageCaptured(true); 
    startTimer();
  };

  const startTimer = () => {
    const id = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id);
  };

  const handleCardClick = (component) => {
    if (isImageCaptured) {
      setActiveComponent(component); 
    }
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'GISNavigation':
        return <GISNavigation darkMode={darkMode} />;
      case 'MySchedule':
        return <MySchedule darkMode={darkMode} addToHistory={(trip) => setHistory((prevHistory) => [
          ...prevHistory,
          `Date: ${trip.date}, Route: ${trip.route}, Bus: ${trip.bus}, Duration: ${trip.duration}`
        ])} />;
      case 'Notifications':
        return (
          <div className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
            <FaBell className="text-red-500 text-3xl mr-4" />
            <div>
              <p className="text-xl font-semibold">Notifications</p>
              <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View system notifications.</p>
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
              <div
                className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'} ${!isImageCaptured ? 'pointer-events-none opacity-50' : ''}`}
                onClick={() => handleCardClick('MySchedule')}
              >
                <FaBus className="text-blue-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">My Schedule</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View and manage your assigned shifts.</p>
                </div>
              </div>
              <div
                className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'} ${!isImageCaptured ? 'pointer-events-none opacity-50' : ''}`}
                onClick={() => handleCardClick('GISNavigation')}
              >
                <FaMapMarkerAlt className="text-green-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">Route Map</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View your assigned routes on the map.</p>
                </div>
              </div>
              <div
                className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'} ${!isImageCaptured ? 'pointer-events-none opacity-50' : ''}`}
                onClick={() => handleCardClick('Notifications')}
              >
                <FaBell className="text-red-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">Notifications</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View system notifications.</p>
                </div>
              </div>
            </div>
            {timer > 0 && (
              <div className="mt-8">
                <p className="text-xl font-bold mb-4">
                  Time Elapsed: {Math.floor(timer / 3600)}h {Math.floor((timer % 3600) / 60)}m {timer % 60}s
                </p>
              </div>
            )}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">History</h2>
              <ul>
                {history.map((entry, index) => (
                  <li key={index} className="mb-2">{entry}</li>
                ))}
              </ul>
            </div>
          </>
        );
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar toggleSidebar={toggleSidebar} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Add a margin between Navbar and main content */}
      <div className="flex flex-grow mt-16">
        <div className={`flex ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
          <div className="relative">
            <button
              onClick={toggleSidebar}
              className={`absolute -right-3 top-4 p-1 ${darkMode ? 'bg-red-700' : 'bg-orange-500'} rounded-full text-white z-10`}
            >
              {isSidebarOpen ? <FaWindowMinimize /> : <FaWindowMaximize />}
            </button>
            <Sidebar
              role="Driver"
              isOpen={isSidebarOpen}
              darkMode={darkMode}
              onOptionClick={setActiveComponent}
              activeComponent={activeComponent}
              setActiveComponent={setActiveComponent}
            />
          </div>
        </div>
        <div
          className={`flex-grow transition-all duration-300 p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} ${isSidebarOpen ? 'ml-0' : 'ml-[-12px]'}`}
        >
          {/* Main Box for Driver Dashboard */}
          <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <h1 className="text-3xl font-bold mb-6">Driver Dashboard</h1>
            
            {/* Start Day / End Day Button */}
            {isDayStarted ? (
              <button
                onClick={handleEndDay}
                className="bg-red-500 text-white px-6 py-3 rounded-lg"
                disabled={!isEndDayEnabled}
              >
                End Day
              </button>
            ) : (
              <button
                onClick={handleStartDay}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg"
              >
                Start Day
              </button>
            )}

            {/* Webcam Section */}
            {showWebcam && (
              <div className="mt-8">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="rounded-lg shadow-lg"
                />
                <button
                  onClick={captureImage}
                  className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg"
                >
                  Capture Image
                </button>
              </div>
            )}

            {/* Render Active Component */}
            <div className="mt-8">{renderActiveComponent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;























/////////////////////


// import React from 'react';

// function CrewMemberDashboard() {
//   return (
    
//     <div className="min-h-screen bg-gray-100 flex">
//       <nav className="bg-red-700 w-64 p-6">
//         <div className="text-white text-2xl font-bold">DTC Crew Member</div>
//         <ul className="mt-8">
//           <li className="text-white py-2 hover:bg-red-600 rounded-lg px-4">
//             <a href="#">Dashboard</a>
//           </li>
//           <li className="text-white py-2 hover:bg-red-600 rounded-lg px-4">
//             <a href="#">View Schedule</a>
//           </li>
//           <li className="text-white py-2 hover:bg-red-600 rounded-lg px-4">
//             <a href="#">Assigned Routes</a>
//           </li>
//           <li className="text-white py-2 hover:bg-red-600 rounded-lg px-4">
//             <a href="#">Report Issues</a>
//           </li>
//           <li className="text-white py-2 hover:bg-red-600 rounded-lg px-4">
//             <a href="#">Notifications</a>
//           </li>
//           <li className="text-white py-2 hover:bg-red-600 rounded-lg px-4">
//             <a href="#">Profile</a>
//           </li>
//           <li className="text-white py-2 hover:bg-red-600 rounded-lg px-4">
//             <a href="#">Logout</a>
//           </li>
//         </ul>
//       </nav>
//       <main className="flex-1 p-6">
//         <div className="bg-white p-8 rounded-lg shadow-lg">
//           <h1 className="text-3xl font-bold mb-6">Crew Member Dashboard</h1>
//           <div className="grid grid-cols-3 gap-6">
//             <div className="bg-gray-200 p-6 rounded-lg">
//               <h2 className="text-xl font-semibold">Current Schedule</h2>
//               <p className="mt-4">Next duty at 2:00 PM.</p>
//             </div>
//             <div className="bg-gray-200 p-6 rounded-lg">
//               <h2 className="text-xl font-semibold">Assigned Route</h2>
//               <p className="mt-4">Route: 25B</p>
//             </div>
//             <div className="bg-gray-200 p-6 rounded-lg">
//               <h2 className="text-xl font-semibold">Issues Reported</h2>
//               <p className="mt-4">No issues reported.</p>
//             </div>
//           </div>
//           <div className="mt-8">
//             <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
//             <ul>
//               <li className="mb-2">
//                 <span className="font-semibold">Schedule updated</span> at 10:00 AM.
//               </li>
//               <li className="mb-2">
//                 <span className="font-semibold">Route assigned</span> at 09:30 AM.
//               </li>
//               <li>
//                 <span className="font-semibold">Checked in</span> at 08:00 AM.
//               </li>
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default CrewMemberDashboard;
