import React, { useState, useRef } from 'react';
import { FaBus, FaMapMarkerAlt, FaBell, FaWindowMaximize, FaWindowMinimize } from 'react-icons/fa';
import Webcam from 'react-webcam';
import Sidebar from '../UTILITIES/Sidebar';
import Navbar from '../UTILITIES/Navbar';
import GISNavigation from '../CREW MEMBER/GISNavigation';
import MySchedule from '../CREW MEMBER/MySchedule'; 
import ConductorSchedule from './ConductorSchedule';
import LocationFetcher from '../CREW MEMBER/LocationFetcher';
import TopPopup from '../CREW MEMBER/TOpPopup';

function ConductorDashboard() {
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // For mobile sidebar toggle
  const [locationError, setLocationError] = useState(null);
 
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const showPopup = () => {
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const webcamRef = useRef(null);

  const handleLocationFetchComplete = () => {
    setIsLocationFetched(true);
    console.log('Location fetching completed.');
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Latitude: ", position.coords.latitude);
          console.log("Longitude: ", position.coords.longitude);
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
           // onComplete(); // Notify parent that location is fetched
          }, 3000); // Hide popup after 3 seconds
        },
        (error) => {
          console.error("Error fetching location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

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

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowWebcam(false);
    setIsImageCaptured(true); 
    startTimer();
    showPopup();
  };

  const startTimer = () => {
    const id = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id);
  };

  const addToHistory = (historyEntry) => {
    setHistory((prevHistory) => [...prevHistory, ...historyEntry]); // Add multiple trips to the history
    console.log("Hello");
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
      case 'ConductorSchedule':
        return <ConductorSchedule
            darkMode={darkMode}
            addToHistory={addToHistory}
            onScheduleClick={() => setActiveComponent('MySchedule') }
          />
;
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
                onClick={() => handleCardClick('ConductorSchedule')}
              >
                <FaBus className="text-blue-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">Schedule Overview</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View your overall schedule.</p>
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
                {history.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
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
              role="Conductor"
              isOpen={isSidebarOpen}
              darkMode={darkMode}
              onOptionClick={handleSidebarClick}
              setActiveComponent={handleSidebarClick}
            />
          </div>
        </div>
        <div
          className={`flex-grow transition-all duration-300 p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} ${isSidebarOpen ? 'ml-0' : 'ml-[-12px]'}`}
        >
          {/* Main Box for Driver Dashboard */}
          <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <h1 className="text-3xl font-bold mb-6">Conductor Dashboard</h1>
            <TopPopup message="Image is Verified" isVisible={isPopupVisible} onClose={closePopup} />
            
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
              <>
              <button
                onClick={handleStartDay}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg"
              >
                Start Day
              </button>
               <div className="flex items-center mt-8">
                 {/* LocationFetcher Component */}
        <LocationFetcher onComplete={handleLocationFetchComplete} />

        {/* Display a message or additional content after location is fetched */}
           {isLocationFetched && (
    <p className="mt-4 text-green-500">Location successfully fetched!</p>
    ) }
         
               {showPopup && (
                 <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
                   Location successfully fetched!
                 </div>
               )}
             </div>
             </>
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

export default ConductorDashboard;