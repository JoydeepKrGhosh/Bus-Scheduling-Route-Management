import { useState, useRef } from 'react';
import { FaBus, FaMapMarkerAlt, FaBell, FaWindowMaximize, FaWindowMinimize, FaTimes } from 'react-icons/fa';
import Webcam from 'react-webcam';
import Sidebar from '../UTILITIES/Sidebar';
import Navbar from '../UTILITIES/Navbar';
import GISNavigation from '../CREW MEMBER/GISNavigation';
import MySchedule from '../CREW MEMBER/MySchedule';
import LocationFetcher from '../CREW MEMBER/LocationFetcher';
import TopPopup from '../CREW MEMBER/TopPopup';
import Notification from '../CREW MEMBER/Notification';
import ImageUpload from './Imageupload';


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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // For mobile sidebar toggle
  const [locationError, setLocationError] = useState(null);
  const [showImageVerifiedPopup, setShowImageVerifiedPopup] = useState(false);
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);
  const [showUpload, setShowUpload] = useState(false);


  // Sample data passed as props
  const userData = {
    name: 'Arjun Singh',
    email: 'singharjun@gmail.com',
    role: 'Driver',
    employeeId: 'ARJUN20',
    license_number: "DL 23D 5678",
    phone_number: "8234970012",
    lastLogin: new Date().toLocaleString(),
  };

 
  


  const workHistory = [
    { date: '2024-09-19', route: 'Route A', bus: 'DTC-120', duration: '3h 20m' },
    { date: '2024-09-19', route: 'Route B', bus: 'DTC-150', duration: '2h 45m' },
    { date: '2024-09-18', route: 'Route C', bus: 'DTC-100', duration: '4h 10m' },
    { date: '2024-09-18', route: 'Route D', bus: 'DTC 104', duration: '1h 55m' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSidebarClick = (component) => {
    setActiveSection(component);
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
    showPopup();
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
          <div
                className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'} ${!isImageCaptured ? 'pointer-events-none ' : ''}`}
                onClick={() => handleSidebarClick('notifications')}
              >
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
            {activeSection === 'dashboard' && (
              <div
                className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'} ${!isImageCaptured ? 'pointer-events-none ' : ''}`}
                onClick={() =>handleSidebarClick('mySchedule')}
              >
                <FaBus className="text-blue-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">My Schedule</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View and manage your assigned shifts.</p>
                </div>
              </div>
            )}
              {activeSection === 'dashboard' && ( 
              <div
                className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'} ${!isImageCaptured ? 'pointer-events-none ' : ''}`}
                onClick={() => handleSidebarClick('gisNavigation')}
              >
                <FaMapMarkerAlt className="text-green-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">Route Map</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View your assigned routes on the map.</p>
                </div>
              </div>
              )}
               {activeSection === 'dashboard' && (
              <div
                className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'} ${!isImageCaptured ? 'pointer-events-none ' : ''}`}
                onClick={() => handleSidebarClick('notifications')}
              >
                <FaBell className="text-red-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">Notifications</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View system notifications.</p>
                </div>
              </div>
               )}
            </div>
            {activeSection === 'dashboard' && (
              <div>
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
            </div>
            )}
          </>
        );
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar toggleSidebar={toggleSidebar} darkMode={darkMode} toggleDarkMode={toggleDarkMode} userData={userData} />
      

      {/* Add a margin between Navbar and main content */}
      <div className="flex flex-grow relative">
      <div className={`hidden lg:flex ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 mt-16 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="relative h-full">
            <button
              onClick={toggleSidebar}
              className={`absolute -right-3 top-4 p-1 ${darkMode ? 'bg-red-600' : 'bg-orange-500'} rounded-full text-white z-10`}
            >
              {isSidebarOpen ? <FaWindowMinimize /> : <FaWindowMaximize />}
            </button>
            <Sidebar
              role="Driver"
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
              role="Driver"
              isOpen={true}
              darkMode={darkMode}
              onOptionClick={handleSidebarClick}
            />
          </div>
        </div>

         {/* Sidebar Toggle Button for Small Screens (Moved to top left under navbar) */}
         <button
          className={`lg:hidden fixed top-[65px] left-1 p-2 rounded-full ${darkMode ? 'bg-red-600' : 'bg-orange-500'} text-white z-30`}
          onClick={toggleMobileSidebar}
        >
          {isMobileSidebarOpen ? <FaWindowMinimize /> : <FaWindowMaximize />}
        </button>
        <div
          className={`flex-grow transition-all duration-300 p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} ${isSidebarOpen ? 'ml-0' : 'ml-[-12px]'}`}
        >
          {/* Main Box for Driver Dashboard */}
          {activeSection === 'dashboard' && (
          <div className={`p-8 mt-[50px] rounded-lg shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <h1 className="text-3xl font-bold mb-8 ">Driver Dashboard</h1>
         

            <TopPopup message="Image is Verified" isVisible={isPopupVisible} onClose={closePopup} />
            <div className="flex items-center mt-8 mb-8">
                  {/* LocationFetcher Component */}
                  <LocationFetcher onComplete={handleLocationFetchComplete} />

                  {/* Display a message or additional content after location is fetched */}
                  {isLocationFetched && (
                    <p className="mt-4 text-green-500"></p>
                  )}

                  {showPopup && (
                    <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
                      Location successfully fetched!
                    </div>
                  )}
                </div>


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

            {/* Popup for "Image Verified" */}
            {showImageVerifiedPopup && (
              <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
                <p>Image verified</p>
              </div>
            )}

            {/* Render Active Component */}
            <div className="mt-8">{renderActiveComponent()}</div>
          </div>
          )}
          {/* Render other sections */}
          {activeSection === 'mySchedule' && <MySchedule darkMode={darkMode} handleCardClick={handleSidebarClick} />}
          {activeSection === 'notifications' && <Notification darkMode={darkMode} handleCardClick={handleSidebarClick} />}
          {activeSection === 'gisNavigation' && <GISNavigation darkMode={darkMode} handleCardClick={handleSidebarClick} />}
          
        
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;