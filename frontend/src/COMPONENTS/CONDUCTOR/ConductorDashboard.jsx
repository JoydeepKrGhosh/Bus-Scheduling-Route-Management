import React, { useState, useRef } from 'react';
import { FaBus, FaCalendarAlt, FaBell, FaWindowMaximize, FaWindowMinimize, FaTimes } from 'react-icons/fa';
import Webcam from 'react-webcam'; // Import Webcam
import Sidebar from '../UTILITIES/Sidebar';
import Navbar from '../UTILITIES/Navbar';
import ConductorSchedule from './ConductorSchedule'; // Import the ConductorSchedule component
import Notification from './Notification'; // Import the Notification component
import LocationFetcher from '../CREW MEMBER/LocationFetcher'; // Import LocationFetcher

function ConductorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // For mobile sidebar toggle

  // State variables for camera and location functionality
  const [isEndDayEnabled, setIsEndDayEnabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [history, setHistory] = useState([]);
  const [intervalId, setIntervalId] = useState(null);
  const [isDayStarted, setIsDayStarted] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isImageCaptured, setIsImageCaptured] = useState(false);
  const [showLocationFetcher, setShowLocationFetcher] = useState(false);

  const webcamRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSidebarClick = (component) => {
    setActiveComponent(component);
    if (window.innerWidth < 1024) {
      // Close sidebar on mobile after clicking an option
      setIsMobileSidebarOpen(false);
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const hideSidebar = () => {
    setIsMobileSidebarOpen(false);
    setIsSidebarOpen(false);
  };

  // Sample notifications data
  const notifications = [
    { message: 'New schedule update available.', time: '10:00 AM' },
    { message: 'Bus route assigned to you.', time: '11:30 AM' },
    { message: 'Reminder: Check the bus status.', time: '1:00 PM' },
  ];

  // Function to handle starting the day
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

  // Function to handle capturing the image
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowWebcam(false);
    setIsImageCaptured(true);
    setShowLocationFetcher(true); // Show location fetcher after capturing image
  };

  // Function to handle completion of location fetching
  const handleLocationComplete = () => {
    setShowLocationFetcher(false);
  };

  // Determine if the conductor is ready to access other functionalities
  const isReady = isDayStarted && isImageCaptured && !showLocationFetcher;

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

      <div className="flex flex-grow relative">
        {/* Sidebar for large screens */}
        <div className={`hidden lg:flex ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 mt-16 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="relative h-full">
            <button
              onClick={toggleSidebar}
              className={`absolute -right-3 top-4 p-1 ${darkMode ? 'bg-red-600' : 'bg-orange-500'} rounded-full text-white z-10`}
            >
              {isSidebarOpen ? <FaWindowMinimize /> : <FaWindowMaximize />}
            </button>
            <Sidebar
              role="Conductor"
              isOpen={isSidebarOpen}
              darkMode={darkMode}
              onOptionClick={handleSidebarClick}
              setActiveComponent={handleSidebarClick}
            />
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`lg:hidden absolute inset-0 z-20 bg-opacity-70 bg-black ${isMobileSidebarOpen ? 'block' : 'hidden'}`}>
          <div className={`w-64 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
            <button
              onClick={hideSidebar}
              className="absolute top-4 right-4 text-xl text-white"
            >
              <FaTimes />
            </button>
            <Sidebar
              role="Conductor"
              isOpen={true}
              darkMode={darkMode}
              onOptionClick={handleSidebarClick}
            />
          </div>
        </div>

        {/* Sidebar Toggle Button for Small Screens */}
        <button
          className={`lg:hidden fixed top-20 top-[65px] left-1 rounded-full ${darkMode ? 'bg-red-600' : 'bg-orange-500'} text-white z-30`}
          onClick={toggleMobileSidebar}
        >
          {isMobileSidebarOpen ? <FaWindowMinimize /> : <FaWindowMaximize />}
        </button>

        {/* Main Content */}
        <div className={`flex-grow transition-all duration-300 p-4 lg:p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} mt-16`}>
          {activeComponent === 'dashboard' && (
            <div className={`p-4 lg:p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Conductor Dashboard</h1>

              {/* Start Day Button */}
              {!isDayStarted ? (
                <button
                  onClick={handleStartDay}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg mb-6"
                >
                  Start Day
                </button>
              ) : (
                <button
                  className="bg-green-500 text-white px-6 py-3 rounded-lg mb-6"
                  disabled
                >
                  Day Started
                </button>
              )}

              {/* Webcam Component */}
              {showWebcam && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold">Capture Your Image</h3>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-64 mt-4"
                  />
                  <button
                    onClick={captureImage}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                  >
                    Capture Image
                  </button>
                </div>
              )}

              {/* Captured Image Display */}
              {isImageCaptured && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold">Captured Image</h3>
                  <img src={capturedImage} alt="Captured" className="mt-4 w-48 h-48 object-cover rounded-lg" />
                </div>
              )}

              {/* LocationFetcher Component */}
              {showLocationFetcher && (
                <LocationFetcher onComplete={handleLocationComplete} />
              )}

              {/* Dashboard Cards (disabled until day is started and location is fetched) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div
                  className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'} ${!isReady ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => handleSidebarClick('checkBusStatus')}
                >
                  <FaBus className="text-green-500 text-3xl mr-4" />
                  <div>
                    <p className="text-xl font-semibold">Check Bus Status</p>
                    <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View the status of assigned buses.</p>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'} ${!isReady ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => handleSidebarClick('scheduleOverview')}
                >
                  <FaCalendarAlt className="text-blue-500 text-3xl mr-4" />
                  <div>
                    <p className="text-xl font-semibold">Schedule Overview</p>
                    <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View assigned schedules.</p>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'} ${!isReady ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => handleSidebarClick('notifications')}
                >
                  <FaBell className="text-yellow-500 text-3xl mr-4" />
                  <div>
                    <p className="text-xl font-semibold">Notifications</p>
                    <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>Check important notifications.</p>
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
                <h2 className="text-2xl font-bold mb-4">Recent Updates</h2>
                <ul>
                  <li className="mb-2">
                    <span className="font-semibold">Conductor A</span> updated the bus status at 10:00 AM.
                  </li>
                  <li className="mb-2">
                    <span className="font-semibold">Conductor B</span> modified the schedule at 11:30 AM.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeComponent === 'checkBusStatus' && (
            <div className={`p-4 lg:p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <h1 className="text-2xl font-bold mb-4">Check Bus Status</h1>
              {/* Content for Check Bus Status */}
            </div>
          )}

          {activeComponent === 'scheduleOverview' && <ConductorSchedule />}

          {activeComponent === 'notifications' && <Notification notifications={notifications} darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}

export default ConductorDashboard;
