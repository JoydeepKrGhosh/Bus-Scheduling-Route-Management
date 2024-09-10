import React, { useState } from 'react';
import { FaBus, FaCalendarAlt, FaBell, FaWindowMaximize, FaWindowMinimize } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer'; // Import the Footer component

function SystemManagerDashboard() {
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
            <Sidebar role="System Manager" isOpen={isSidebarOpen} darkMode={darkMode} /> {/* Pass darkMode to Sidebar */}
          </div>
        </div>
        <div className={`flex-grow transition-all duration-300 p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} ${isSidebarOpen ? 'ml-0' : 'ml-[-12px]'}`}>
          <div className={`p-8 rounded-lg shadow-lg mt-16 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <h1 className="text-3xl font-bold mb-6">System Manager Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg shadow-lg flex items-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <FaBus className="text-green-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">Manage Routes</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>Edit, modify, and manage routes.</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg shadow-lg flex items-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <FaCalendarAlt className="text-blue-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">Schedule Overview</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>View and manage bus schedules.</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg shadow-lg flex items-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <FaBell className="text-yellow-500 text-3xl mr-4" />
                <div>
                  <p className="text-xl font-semibold">Resource Allocation</p>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-black'}`}>Allocate buses and drivers to routes.</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Recent Updates</h2>
              <ul>
                <li className="mb-2">
                  <span className="font-semibold">User A</span> adjusted the schedule at 10:00 AM.
                </li>
                <li className="mb-2">
                  <span className="font-semibold">User B</span> updated the route at 09:30 AM.
                </li>
                <li>
                  <span className="font-semibold">User C</span> changed system settings at 08:00 AM.
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

export default SystemManagerDashboard;





/////////////////////


// import React from 'react';


// function SystemManagerDashboard() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       <nav className="bg-green-700 w-64 p-6">
//         <div className="text-white text-2xl font-bold">DTC System Manager</div>
//         <ul className="mt-8">
//           <li className="text-white py-2 hover:bg-green-600 rounded-lg px-4">
//             <a href="#">Dashboard</a>
//           </li>
//           <li className="text-white py-2 hover:bg-green-600 rounded-lg px-4">
//             <a href="#">Manage Schedules</a>
//           </li>
//           <li className="text-white py-2 hover:bg-green-600 rounded-lg px-4">
//             <a href="#">Manage Routes</a>
//           </li>
//           <li className="text-white py-2 hover:bg-green-600 rounded-lg px-4">
//             <a href="#">System Settings</a>
//           </li>
//           <li className="text-white py-2 hover:bg-green-600 rounded-lg px-4">
//             <a href="#">Reports</a>
//           </li>
//           <li className="text-white py-2 hover:bg-green-600 rounded-lg px-4">
//             <a href="#">Notifications</a>
//           </li>
//           <li className="text-white py-2 hover:bg-green-600 rounded-lg px-4">
//             <a href="#">Profile</a>
//           </li>
//           <li className="text-white py-2 hover:bg-green-600 rounded-lg px-4">
//             <a href="#">Logout</a>
//           </li>
//         </ul>
//       </nav>
//       <main className="flex-1 p-6">
//         <div className="bg-white p-8 rounded-lg shadow-lg">
//           <h1 className="text-3xl font-bold mb-6">System Manager Dashboard</h1>
//           <div className="grid grid-cols-3 gap-6">
//             <div className="bg-gray-200 p-6 rounded-lg">
//               <h2 className="text-xl font-semibold">Schedule Management</h2>
//               <p className="mt-4">Total Schedules: 80</p>
//             </div>
//             <div className="bg-gray-200 p-6 rounded-lg">
//               <h2 className="text-xl font-semibold">Route Management</h2>
//               <p className="mt-4">Active Routes: 50</p>
//             </div>
//             <div className="bg-gray-200 p-6 rounded-lg">
//               <h2 className="text-xl font-semibold">System Settings</h2>
//               <p className="mt-4">Configuration up to date.</p>
//             </div>
//           </div>
//           <div className="mt-8">
//             <h2 className="text-2xl font-bold mb-4">Recent Updates</h2>
//             <ul>
//               <li className="mb-2">
//                 <span className="font-semibold">User A</span> adjusted the schedule at 10:00 AM.
//               </li>
//               <li className="mb-2">
//                 <span className="font-semibold">User B</span> updated the route at 09:30 AM.
//               </li>
//               <li>
//                 <span className="font-semibold">User C</span> changed system settings at 08:00 AM.
//               </li>
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default SystemManagerDashboard;
