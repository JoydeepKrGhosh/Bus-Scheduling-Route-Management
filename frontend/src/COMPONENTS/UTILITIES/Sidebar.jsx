// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaTachometerAlt, FaUsers, FaBus, FaFileAlt, FaBell } from 'react-icons/fa';

// function Sidebar({ role }) {
//   const links = {
//     Admin: [
//       { name: 'Dashboard', icon: FaTachometerAlt, path: '/admin' },
//       { name: 'Manage Users', icon: FaUsers, path: '/admin/manage-users' },
//       { name: 'Manage Routes', icon: FaBus, path: '/admin/manage-routes' },
//       { name: 'System Logs', icon: FaFileAlt, path: '/admin/system-logs' },
//       { name: 'Notifications', icon: FaBell, path: '/admin/notifications' },
//     ],
//     'System Manager': [
//       { name: 'Dashboard', icon: FaTachometerAlt, path: '/system-manager' },
//       { name: 'Manage Routes', icon: FaBus, path: '/system-manager/manage-routes' },
//       { name: 'Schedule Overview', icon: FaFileAlt, path: '/system-manager/schedule-overview' },
//       { name: 'Resource Allocation', icon: FaBell, path: '/system-manager/resource-allocation' },
//     ],
//     'Crew Member': [
//       { name: 'Dashboard', icon: FaTachometerAlt, path: '/crew-member' },
//       { name: 'My Schedule', icon: FaBus, path: '/crew-member/my-schedule' },
//       { name: 'Notifications', icon: FaBell, path: '/crew-member/notifications' },
//     ],
//   };

//   return (
//     <div className="w-64 h-screen bg-black text-white flex flex-col">
//       <div className="p-4 text-center font-bold text-xl border-b border-gray-700">
//         DTC System
//       </div>
//       <div className="flex-grow p-4">
//         {links[role].map((link) => (
//           <Link to={link.path} key={link.name} className="flex items-center p-2 mb-2 hover:bg-gray-800 rounded">
//             <link.icon className="mr-4" />
//             {link.name}
//           </Link>
//         ))}
//       </div>
//       <div className="p-4 border-t border-gray-700">
//         <Link to="/" className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 rounded">
//           Logout
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Sidebar;



///////////////


// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { FaUsers, FaRoute, FaFileAlt, FaBell, FaSignOutAlt } from 'react-icons/fa';

// const Sidebar = () => {
//   return (
//     <div className="h-screen bg-black text-white w-64 p-4">
//       <div className="mb-6">
//         <img src="path_to_logo.png" alt="DTC Logo" className="mx-auto w-16 h-16" />
//       </div>
//       <nav>
//         <NavLink to="/admin" className="flex items-center p-2 mb-2 hover:bg-gray-700 rounded">
//           <FaUsers className="mr-2" /> Manage Users
//         </NavLink>
//         <NavLink to="/admin/routes" className="flex items-center p-2 mb-2 hover:bg-gray-700 rounded">
//           <FaRoute className="mr-2" /> Manage Routes
//         </NavLink>
//         <NavLink to="/admin/reports" className="flex items-center p-2 mb-2 hover:bg-gray-700 rounded">
//           <FaFileAlt className="mr-2" /> Reports
//         </NavLink>
//         <NavLink to="/admin/notifications" className="flex items-center p-2 mb-2 hover:bg-gray-700 rounded">
//           <FaBell className="mr-2" /> Notifications
//         </NavLink>
//         <NavLink to="/admin/profile" className="flex items-center p-2 mb-2 hover:bg-gray-700 rounded">
//           <FaSignOutAlt className="mr-2" /> Profile
//         </NavLink>
//         <NavLink to="/logout" className="flex items-center p-2 mb-2 hover:bg-gray-700 rounded">
//           <FaSignOutAlt className="mr-2" /> Logout
//         </NavLink>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

////////////////////////////////////////

import React from 'react';
import { FaTachometerAlt, FaUsers, FaBus, FaFileAlt, FaBell, FaBars, FaMapMarkerAlt, FaCog } from 'react-icons/fa';

function Sidebar({ role, isOpen, darkMode, setActiveComponent }) {
  // Define the links for different roles
  const links = {
    Admin: [
      { name: 'Dashboard', icon: FaTachometerAlt, component: 'overview' },
      { name: 'Active Buses', icon: FaUsers, component: 'manageBuses' },
      { name: 'Assign Routes', icon: FaBus, component: 'assignRoutes' },
      { name: 'Employee Management', icon: FaFileAlt, component: 'employeeManagement' },
      { name: 'Reports and Analytics', icon: FaBell, component: 'reportsAnalytics' },
      { name: 'System Logs', icon: FaCog, component: 'systemLogs' },
    ],
    Conductor: [
      { name: 'Dashboard', icon: FaTachometerAlt, component: 'dashboard' },
      { name: 'Check Bus Status', icon: FaBus, component: 'checkBusStatus' },
      { name: 'Schedule Overview', icon: FaFileAlt, component: 'scheduleOverview' },
      { name: 'Resource Allocation', icon: FaBell, component: 'resourceAllocation' },
      { name: 'Notifications', icon: FaBell, component: 'notifications' }, // Added Notifications option
    ],
    Driver: [
      { name: 'Dashboard', icon: FaTachometerAlt, component: 'dashboard' },
      { name: 'My Schedule', icon: FaBus, component: 'mySchedule' },
      { name: 'Notifications', icon: FaBell, component: 'notifications' },
      { name: 'GIS Navigation', icon: FaMapMarkerAlt, component: 'gisNavigation' },
    ],
  };

  return (
    <div
      className={`transition-all duration-300 flex flex-col 
      ${isOpen ? 'w-64' : 'w-20'} 
      ${darkMode ? 'bg-[#28293E] text-[#4D91FF]' : 'bg-gray-900 text-white'} 
      h-screen sm:gap-4 md:gap-0 lg:gap-0 flex-grow sm:flex-grow`} // Adjust margin-top for small screens and ensure full height
    >
      <div
        className={`p-4 flex justify-between items-center border-b 
        ${darkMode ? 'border-gray-200' : 'border-gray-700'}`}
      >
        {isOpen ? (
          <div className="font-bold text-xl">DTC System</div>
        ) : (
          <button onClick={() => setActiveComponent(null)} className={darkMode ? 'text-blue-400' : 'text-white'}>

          </button>
        )}
      </div>

      <div className="flex-grow p-4">
        {links[role].map((link) => (
          <div
            key={link.name}
            onClick={() => setActiveComponent(link.component)} // Set active component on click
            className={`flex items-center p-2 mb-2 rounded cursor-pointer 
            ${darkMode ? 'hover:bg-blue-100' : 'hover:bg-gray-800'}`}
          >
            <link.icon className="mr-4 text-xl" />
            {isOpen && <span>{link.name}</span>}
          </div>
        ))}
      </div>

      <div className={`p-4 border-t ${darkMode ? 'border-gray-200' : 'border-gray-700'}`}>
        <button
          onClick={() => setActiveComponent('/')}
          className={`flex items-center justify-center p-2 rounded 
          ${darkMode ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {isOpen && 'Logout'}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;











