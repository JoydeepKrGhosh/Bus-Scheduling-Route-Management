import React, { useState } from 'react';
import { FaBus, FaCalendarAlt, FaBell, FaWindowMaximize, FaWindowMinimize } from 'react-icons/fa';
import Sidebar from '../UTILITIES/Sidebar';
import Navbar from '../UTILITIES/Navbar';
import Footer from '../UTILITIES/Footer'; // Import the Footer component

function ConductorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode); // Toggle dark mode
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} /> {/* Pass darkMode props */}
      <div className="flex flex-grow">
        <div className={`flex ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 mt-16`}>
          <div className="relative">
            <button
              onClick={toggleSidebar}
              className={`absolute -right-3 top-4 p-1 ${darkMode ? 'bg-red-700' : 'bg-orange-500'} rounded-full text-white z-10`}
            >
              {isSidebarOpen ? <FaWindowMinimize /> : < FaWindowMaximize />}
            </button>
            <Sidebar role="Conductor" isOpen={isSidebarOpen} darkMode={darkMode} /> {/* Pass darkMode to Sidebar */}
          </div>
        </div>
        <div className={`flex-grow transition-all duration-300 p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} ${isSidebarOpen ? 'ml-0' : 'ml-[-12px]'}`}>
          <div className={`p-8 rounded-lg shadow-lg mt-16 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <h1 className="text-3xl font-bold mb-6">Crew Member Dashboard</h1>
            <h2 className="text-2xl font-semibold mb-4">Conductor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg shadow-lg flex items-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <FaBus className="text-green-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">Check Bus Status</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View the status of assigned buses.</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg shadow-lg flex items-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <FaCalendarAlt className="text-blue-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">Schedule Overview</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View assigned schedules.</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg shadow-lg flex items-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <FaBell className="text-yellow-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">Notifications</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>Check important notifications.</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Recent Updates</h2>
              <ul>
                <li className="mb-2">
                  <span className="font-semibold">Conductor A</span> updated the bus status at 10:00 AM.
                </li>
                <li className="mb-2">
                  <span className="font-semibold">Conductor B</span> modified the schedule at 09:30 AM.
                </li>
                <li>
                  <span className="font-semibold">Conductor C</span> checked notifications at 08:00 AM.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer darkMode={darkMode} /> {/* Pass darkMode to Footer */}
    </div>
  );
}

export default ConductorDashboard;
