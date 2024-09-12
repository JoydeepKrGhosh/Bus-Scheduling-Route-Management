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
import Webcam from 'react-webcam'; // Import react-webcam
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import GISNavigation from './GISNavigation';
import MySchedule from './MySchedule'; // Import the modified MySchedule

function DriverDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const [activeComponent, setActiveComponent] = useState('Dashboard'); // State to track the active component
  const [isDayStarted, setIsDayStarted] = useState(false); // Track if day has started
  const [isEndDayEnabled, setIsEndDayEnabled] = useState(false); // Track if "End Day" button is enabled
  const [timer, setTimer] = useState(0); // Timer state
  const [intervalId, setIntervalId] = useState(null); // Store interval ID for timer
  const [history, setHistory] = useState([]); // Store history of start and end times
  const [showWebcam, setShowWebcam] = useState(false); // State to show/hide webcam
  const [capturedImage, setCapturedImage] = useState(null); // State to store captured image

  const webcamRef = useRef(null); // Reference for webcam

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode); // Toggle dark mode
  };

  // Function to start the day and show the camera
  const handleStartDay = () => {
    setIsDayStarted(true);
    setIsEndDayEnabled(true);
    setShowWebcam(true); // Show webcam when starting the day
  };

  // Function to end the day
  const handleEndDay = () => {
    setIsEndDayEnabled(false);
    clearInterval(intervalId); // Stop the timer
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);
    const seconds = timer % 60;
    const formattedTime = `${hours}h ${minutes}m ${seconds}s`;

    // Add the recorded time to history
    setHistory((prevHistory) => [...prevHistory, `Day lasted for: ${formattedTime}`]);
    setTimer(0); // Reset timer
    setIsDayStarted(false); // Reset day started status
  };

  // Capture image from webcam
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc); // Store captured image
    setShowWebcam(false); // Hide webcam after capturing image
    startTimer(); // Start the timer after photo is taken
  };

  // Function to start the timer
  const startTimer = () => {
    const id = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000); // Update timer every second
    setIntervalId(id);
  };

  // Disable interaction with cards until day is started
  const cardInteractionDisabled = !isDayStarted;

  // Function to render the active component based on what is selected in the Sidebar
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
          <div className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} ${cardInteractionDisabled ? 'pointer-events-none opacity-50' : ''}`}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <div className={`p-4 rounded-lg shadow-lg flex items-center ${darkMode ? 'bg-gray-600' : 'bg-white'} ${cardInteractionDisabled ? 'pointer-events-none opacity-50' : ''}`}>
                <FaBus className="text-blue-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">My Schedule</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View and manage your assigned shifts.</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg shadow-lg flex items-center ${darkMode ? 'bg-gray-600' : 'bg-white'} ${cardInteractionDisabled ? 'pointer-events-none opacity-50' : ''}`}>
                <FaMapMarkerAlt className="text-green-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">Route Map</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View your assigned routes on the map.</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg shadow-lg flex items-center ${darkMode ? 'bg-gray-600' : 'bg-white'} ${cardInteractionDisabled ? 'pointer-events-none opacity-50' : ''}`}>
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
      <div className="flex flex-grow">
        <div className={`flex ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 mt-16`}>
          <div className="relative">
            <button
              onClick={toggleSidebar}
              className={`absolute -right-3 top-4 p-1 ${darkMode ? 'bg-red-700' : 'bg-orange-500'} rounded-full text-white z-10`}
            >
              {!isSidebarOpen ? <FaWindowMaximize /> : <FaWindowMinimize />}
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
          <div className={`p-8 rounded-lg shadow-lg mt-16 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <h2 className="text-3xl font-bold mb-6">Crew Member</h2>
            <h3 className="text-2xl font-semibold mb-6">Driver</h3>
            {isDayStarted ? (
              <button
                onClick={handleEndDay}
                className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition-colors"
                disabled={!isEndDayEnabled}
              >
                End Day
              </button>
            ) : (
              <button
              onClick={handleStartDay}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
            >
              Start Day
            </button>
          )}
          {showWebcam && (
            <div className="mt-8">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
              />
              <button
                onClick={captureImage}
                className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 mt-4"
              >
                Capture Image
              </button>
              {capturedImage && (
                <div className="mt-4">
                  <p className="text-lg font-semibold">Captured Image:</p>
                  <img src={capturedImage} alt="Captured" className="mt-2" />
                </div>
              )}
            </div>
          )}
          <div className="mt-12">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
); }

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
