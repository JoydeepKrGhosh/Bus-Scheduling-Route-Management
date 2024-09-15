import React, { useState } from 'react';
import { FaUsers, FaBus, FaFileAlt, FaBell, FaChartLine, FaWindowMaximize, FaWindowMinimize } from 'react-icons/fa';
import Sidebar from '../UTILITIES/Sidebar';
import Navbar from '../UTILITIES/Navbar';
import ActiveBuses from './ActiveBuses';
import AssignRoutes from './AssignRoutes';
import ReportsAnalytics from './ReportsAnalytics'; // Import the ReportsAnalytics component
import EmployeeManagement from './EmployeeManagement'; // Import the EmployeeManagement component

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSidebarClick = (component) => {
    setActiveSection(component);
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className={`flex ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 mt-16 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="relative">
            <button
              onClick={toggleSidebar}
              className={`absolute -right-3 top-4 p-1 ${darkMode ? 'bg-red-600' : 'bg-orange-500'} rounded-full text-white z-10`}
            >
              {isSidebarOpen ? <FaWindowMinimize /> : <FaWindowMaximize />}
            </button>
            <Sidebar
              role="Admin"
              isOpen={isSidebarOpen}
              darkMode={darkMode}
              onOptionClick={handleSidebarClick}
              setActiveComponent={handleSidebarClick}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-grow transition-all duration-300 p-4 lg:p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {activeSection === 'overview' && (
            <div className={`p-4 lg:p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} mt-16`}>
              <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Admin Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div
                  className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'}`}
                  onClick={() => handleSidebarClick('employeeManagement')}
                >
                  <FaUsers className={`text-2xl lg:text-3xl mr-4 ${darkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                  <div>
                    <p className={`text-lg lg:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Employee Management</p>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Manage employees, add, edit, and delete.</p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'}`}
                  onClick={() => handleSidebarClick('manageBuses')}
                >
                  <FaBus className={`text-2xl lg:text-3xl mr-4 ${darkMode ? 'text-green-300' : 'text-green-500'}`} />
                  <div>
                    <p className={`text-lg lg:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Active Buses</p>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-500'}>View and manage active buses.</p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'}`}
                  onClick={() => handleSidebarClick('assignRoutes')}
                >
                  <FaBus className={`text-2xl lg:text-3xl mr-4 ${darkMode ? 'text-yellow-300' : 'text-yellow-500'}`} />
                  <div>
                    <p className={`text-lg lg:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Assign Routes</p>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Assign routes to buses visually.</p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg shadow-lg flex items-center cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-white'}`}
                  onClick={() => handleSidebarClick('reportsAnalytics')}
                >
                  <FaChartLine className={`text-2xl lg:text-3xl mr-4 ${darkMode ? 'text-purple-300' : 'text-purple-500'}`} />
                  <div>
                    <p className={`text-lg lg:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Reports & Analytics</p>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-500'}>View performance reports and analytics.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 lg:mt-8">
                <h2 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-4">Recent Activity</h2>
                <ul>
                  <li className="mb-1 lg:mb-2">
                    <span className="font-semibold">User X</span> added a new route at 10:30 AM.
                  </li>
                  <li className="mb-1 lg:mb-2">
                    <span className="font-semibold">User Y</span> updated a schedule at 09:45 AM.
                  </li>
                  <li>
                    <span className="font-semibold">User Z</span> generated a report at 08:15 AM.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Render other sections */}
          {activeSection === 'employeeManagement' && <EmployeeManagement darkMode={darkMode} handleCardClick={handleSidebarClick} />}
          {activeSection === 'manageBuses' && <ActiveBuses darkMode={darkMode} handleCardClick={handleSidebarClick} />}
          {activeSection === 'assignRoutes' && <AssignRoutes darkMode={darkMode} handleCardClick={handleSidebarClick} />}
          {activeSection === 'reportsAnalytics' && <ReportsAnalytics darkMode={darkMode} handleCardClick={handleSidebarClick} />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;














/////////////////////////////


// import React from 'react';

// function AdminDashboard() {
//   return (
    
//     <div className="min-h-screen bg-gray-100 flex">
//       <nav className="bg-indigo-700 w-64 p-6">
//         <div className="text-white text-2xl font-bold">DTC Admin</div>
//         <ul className="mt-8">
//           <li className="text-white py-2 hover:bg-indigo-600 rounded-lg px-4">
//             <a href="#">Dashboard</a>
//           </li>
//           <li className="text-white py-2 hover:bg-indigo-600 rounded-lg px-4">
//             <a href="#">Manage Users</a>
//           </li>
//           <li className="text-white py-2 hover:bg-indigo-600 rounded-lg px-4">
//             <a href="#">Manage Routes</a>
//           </li>
//           <li className="text-white py-2 hover:bg-indigo-600 rounded-lg px-4">
//             <a href="#">System Logs</a>
//           </li>
//           <li className="text-white py-2 hover:bg-indigo-600 rounded-lg px-4">
//             <a href="#">Reports</a>
//           </li>
//           <li className="text-white py-2 hover:bg-indigo-600 rounded-lg px-4">
//             <a href="#">Notifications</a>
//           </li>
//           <li className="text-white py-2 hover:bg-indigo-600 rounded-lg px-4">
//             <a href="#">Profile</a>
//           </li>
//           <li className="text-white py-2 hover:bg-indigo-600 rounded-lg px-4">
//             <a href="#">Logout</a>
//           </li>
//         </ul>
//       </nav>
//       <main className="flex-1 p-6">
//         <div className="bg-white p-8 rounded-lg shadow-lg">
//           <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
//           <div className="grid grid-cols-3 gap-6">
//             <div className="bg-gray-200 p-6 rounded-lg">
//               <h2 className="text-xl font-semibold">System Health</h2>
//               <p className="mt-4">All systems operational.</p>
//             </div>
//             <div className="bg-gray-200 p-6 rounded-lg">
//               <h2 className="text-xl font-semibold">User Management</h2>
//               <p className="mt-4">Total Users: 120</p>
//             </div>
//             <div className="bg-gray-200 p-6 rounded-lg">
//               <h2 className="text-xl font-semibold">Route Overview</h2>
//               <p className="mt-4">Active Routes: 50</p>
//             </div>
//           </div>
//           <div className="mt-8">
//             <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
//             <ul>
//               <li className="mb-2">
//                 <span className="font-semibold">User X</span> added a new route at 10:30 AM.
//               </li>
//               <li className="mb-2">
//                 <span className="font-semibold">User Y</span> updated a schedule at 09:45 AM.
//               </li>
//               <li>
//                 <span className="font-semibold">User Z</span> generated a report at 08:15 AM.
//               </li>
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default AdminDashboard;
