// import React, { useState } from 'react';
// import { FaBars,FaChevronDown } from 'react-icons/fa';

// const Navbar = () => {

//   return (
//     <nav className="bg-gradient-to-r from-indigo-900 to-blue-900 shadow-lg p-4">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex-shrink-0 flex items-center">
//             <span className="text-white text-2xl font-bold">HOME</span>
//           </div>
//           <div className="hidden md:flex md:items-center md:space-x-8">
//             <a href="#" className="text-white text-lg">ABOUT US</a>
//             <div className="relative flex items-center space-x-2 cursor-pointer">
//               <span className="text-white text-lg">SERVICES</span>
//               <FaChevronDown className="text-white" />
//               <select className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer">
//                 <option>OPTION 1</option>
//                 <option>OPTION 2</option>
//                 <option>OPTION 3</option>
//               </select>
//             </div>
//             <div className="relative flex items-center space-x-2 cursor-pointer">
//               <span className="text-white text-lg">OUR BUS</span>
//               <FaChevronDown className="text-white" />
//               <select className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer">
//                 <option>OPTION 1</option>
//                 <option>OPTION 2</option>
//                 <option>OPTION 3</option>
//               </select>
//             </div>
//             <div className="flex flex-col items-center">
//               <span className="text-white text-lg">BIGINTRA</span>
//               <span className="text-white">+1-234-567-890</span>
//             </div>
//             <button className="bg-green-400 text-white rounded-full px-4 py-2 border border-white">SIGN IN</button>
//           </div>
//           <div className="flex md:hidden items-center">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-white"
//             >
//               <FaBars size={24} />
//             </button>
//           </div>
//         </div>
//       </div>

//         <div className="md:hidden mt-4 space-y-4">
//           <a href="#" className="block text-white text-lg">ABOUT US</a>
//           <div>
//             <label className="text-white text-lg cursor-pointer">SERVICES</label>
//             <select className="w-full mt-2 bg-transparent text-white border-none">
//               <option className="bg-indigo-900 text-white">OPTION 1</option>
//               <option className="bg-indigo-900 text-white">OPTION 2</option>
//               <option className="bg-indigo-900 text-white">OPTION 3</option>
//             </select>
//           </div>
//           <div>
//             <label className="text-white text-lg cursor-pointer">OUR BUS</label>
//             <select className="w-full mt-2 bg-transparent text-white border-none">
//               <option className="bg-indigo-900 text-white">OPTION 1</option>
//               <option className="bg-indigo-900 text-white">OPTION 2</option>
//               <option className="bg-indigo-900 text-white">OPTION 3</option>
//             </select>
//           </div>
//           <div className="flex flex-col items-start">
//             <span className="text-white text-lg">BIGINTRA</span>
//             <span className="text-white">+1-234-567-890</span>
//           </div>
//           <button className="bg-green-400 text-white rounded-full px-4 py-2 border border-white w-full">
//             SIGN IN
//           </button>
//         </div>

//     </nav>
//   );
// };

// export default Navbar;


// import React, { useState } from 'react';
// import { FaBars } from 'react-icons/fa';
// // import logo from './dtc-logo.png'; // Replace with your logo image path

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="bg-gradient-to-r from-indigo-900 to-blue-600 text-white shadow-lg h-24 relative z-10">
//       <div className="container mx-auto px-4 flex justify-between items-center h-full">
//         {/* Left Side - Logo */}
//         <div className="flex items-center space-x-4">
//           <a href="/" className="flex items-center">
//             <img src="https://web.moxcreative.com/bigtranz/wp-content/uploads/sites/19/2023/03/Coach-Bus-mockup-04.png" alt="Delhi Transport Corporation" className="h-16" />
//           </a>
//           <a href="/" className="hidden lg:block text-2xl md:text-3xl font-bold ml-4">HOME</a>
//         </div>

//         {/* Middle - Navigation Links */}
//         <div className="hidden lg:flex space-x-8">
//           <a href="#about" className="text-xl">ABOUT US</a>
//           <div className="relative group text-xl">
//             <button className="focus:outline-none">SERVICES</button>
//             <div className="absolute hidden group-hover:flex flex-col bg-white text-black mt-2 rounded shadow-lg">
//               <a href="#option1" className="px-4 py-2 hover:bg-gray-200">OPTION 1</a>
//               <a href="#option2" className="px-4 py-2 hover:bg-gray-200">OPTION 2</a>
//               <a href="#option3" className="px-4 py-2 hover:bg-gray-200">OPTION 3</a>
//             </div>
//           </div>
//           <div className="relative group text-xl">
//             <button className="focus:outline-none">OUR BUS</button>
//             <div className="absolute hidden group-hover:flex flex-col bg-white text-black mt-2 rounded shadow-lg">
//               <a href="#option1" className="px-4 py-2 hover:bg-gray-200">OPTION 1</a>
//               <a href="#option2" className="px-4 py-2 hover:bg-gray-200">OPTION 2</a>
//               <a href="#option3" className="px-4 py-2 hover:bg-gray-200">OPTION 3</a>
//             </div>
//           </div>
//           <div className="text-xl">
//             <div>
//               <span className="block">BIGINTRA</span>
//               <span className="block text-sm">+123 456 7890</span>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Sign In Button */}
//         <div className="hidden lg:block">
//           <button className="bg-green-500 text-white px-4 py-2 rounded-full">SIGN IN</button>
//         </div>

//         {/* Mobile Menu Toggle */}
//         <div className="lg:hidden">
//           <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
//             <FaBars size={24} />
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="lg:hidden bg-indigo-900 text-white w-full absolute top-24 left-0">
//           <div className="flex flex-col space-y-4 p-4">
//             <a href="#about" className="text-lg">ABOUT US</a>
//             <div className="relative">
//               <button className="text-lg focus:outline-none">SERVICES</button>
//               <div className="flex flex-col mt-2">
//                 <a href="#option1" className="px-4 py-2 hover:bg-indigo-800">OPTION 1</a>
//                 <a href="#option2" className="px-4 py-2 hover:bg-indigo-800">OPTION 2</a>
//                 <a href="#option3" className="px-4 py-2 hover:bg-indigo-800">OPTION 3</a>
//               </div>
//             </div>
//             <div className="relative">
//               <button className="text-lg focus:outline-none">OUR BUS</button>
//               <div className="flex flex-col mt-2">
//                 <a href="#option1" className="px-4 py-2 hover:bg-indigo-800">OPTION 1</a>
//                 <a href="#option2" className="px-4 py-2 hover:bg-indigo-800">OPTION 2</a>
//                 <a href="#option3" className="px-4 py-2 hover:bg-indigo-800">OPTION 3</a>
//               </div>
//             </div>
//             <div className="text-lg">
//               <div>
//                 <span className="block">BIGINTRA</span>
//                 <span className="block text-sm">+123 456 7890</span>
//               </div>
//             </div>
//             <button className="bg-green-500 text-white px-4 py-2 rounded-full">SIGN IN</button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


/////////////////////////////////

// import React from 'react';
// import { FaUserCircle } from 'react-icons/fa';

// function Navbar() {
//   return (
//     <nav className="fixed top-0 left-0 w-full bg-orange-500 p-4 flex justify-between items-center z-50">
//       <div className="flex items-center">
//         <img src="https://dtcpass.delhi.gov.in/images/DTC1.png" alt="DTC Logo" className="h-8 mr-3" />
//         <h1 className="text-white text-xl font-bold">DTC Employee Dashboard</h1>
//       </div>
//       <div className="relative">
//         <FaUserCircle className="text-white text-3xl cursor-pointer" />
//         <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10 hidden group-hover:block">
//           <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile Settings</a>
//           <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Logout</a>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


/////////////////////////////////////


// import React, { useState } from 'react';
// import { FaUserCircle } from 'react-icons/fa';
// import ProfilePage from './ProfilePage'; // Import the ProfilePage component

// function Navbar() {
//   const [showProfile, setShowProfile] = useState(false);

//   const handleProfileClick = () => {
//     setShowProfile(true);
//   };

//   const handleCloseProfile = () => {
//     setShowProfile(false);
//   };

//   return (
//     <nav className="fixed top-0 left-0 w-full bg-orange-500 p-4 flex justify-between items-center z-50">
//       <div className="flex items-center">
//         <img src="https://dtcpass.delhi.gov.in/images/DTC1.png" alt="DTC Logo" className="h-8 mr-3" />
//         <h1 className="text-white text-xl font-bold">DTC Employee Dashboard</h1>
//       </div>
//       <div className="flex items-center">
//         <button 
//           className="bg-white text-orange-500 px-4 py-2 rounded-full mr-3"
//           onClick={() => alert('Logged out successfully!')}
//         >
//           Logout
//         </button>
//         <FaUserCircle 
//           className="text-white text-3xl cursor-pointer" 
//           onClick={handleProfileClick} 
//         />
//       </div>
//       {showProfile && <ProfilePage onClose={handleCloseProfile} />}
//     </nav>
//   );
// }

// export default Navbar;

// MAIN COMPONENT

/////////////////////////////////////

// import React, { useState } from 'react';
// import { FaUserCircle, FaCog } from 'react-icons/fa';
// import ProfilePage from './ProfilePage'; // Import the ProfilePage component
// import SettingsPage from './SettingsPage'; // Import the SettingsPage component

// function Navbar() {
//   const [showProfile, setShowProfile] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);

//   const handleProfileClick = () => {
//     setShowProfile(true);
//   };

//   const handleCloseProfile = () => {
//     setShowProfile(false);
//   };

//   const handleSettingsClick = () => {
//     setShowSettings(true);
//   };

//   const handleCloseSettings = () => {
//     setShowSettings(false);
//   };

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     document.body.classList.toggle('dark-mode', !darkMode); // Toggle body class for dark mode
//   };

//   return (
//     <nav className={`fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50 ${darkMode ? 'bg-gray-800' : 'bg-orange-500'}`}>
//       <div className="flex items-center">
//         <img src="https://dtcpass.delhi.gov.in/images/DTC1.png" alt="DTC Logo" className="h-8 mr-3" />
//         <h1 className="text-white text-xl font-bold">DTC Employee Dashboard</h1>
//       </div>
//       <div className="flex items-center">
//         <button 
//           className="bg-white text-orange-500 px-4 py-2 rounded-full mr-3"
//           onClick={() => alert('Logged out successfully!')}
//         >
//           Logout
//         </button>
//         <FaUserCircle 
//           className="text-white text-3xl cursor-pointer mr-4" 
//           onClick={handleProfileClick} 
//         />
//         <FaCog 
//           className="text-white text-3xl cursor-pointer" 
//           onClick={handleSettingsClick} 
//         />
//       </div>

//       {showProfile && <ProfilePage onClose={handleCloseProfile} />}
//       {showSettings && <SettingsPage onClose={handleCloseSettings} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}
//     </nav>
//   );
// }

// export default Navbar;

//MAIN COMPONENT-1

/////////////////////////////////////////

import React, { useState } from 'react';
import { FaUserCircle, FaCog } from 'react-icons/fa';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';

function Navbar({ darkMode, toggleDarkMode, toggleSidebar, isSidebarOpen }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50 transition-all duration-300 ${darkMode ? 'bg-[#28293E]' : 'bg-orange-500'
        } ${isSidebarOpen ? 'md:pl-64' : 'md:pl-16'} `}
    >
      <div className="flex items-center">
        {/* Sidebar toggle for small screens removed */}
        <img
          src="https://dtcpass.delhi.gov.in/images/DTC1.png"
          alt="DTC Logo"
          className="h-8 mr-3"
        />
        <h1 className={`text-xl font-bold hidden sm:block ${darkMode ? 'text-gray-100' : 'text-white'}`}>
          DTC Employee Dashboard
        </h1>
        <h1 className={`text-xl font-bold block sm:hidden ${darkMode ? 'text-gray-100' : 'text-white'}`}>
         WELCOME !
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className={`px-4 py-2 rounded-full mr-3 hidden sm:block ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-orange-500'
            }`}
          onClick={() => alert('Logged out successfully!')}
        >
          Logout
        </button>
        <FaUserCircle
          className={`text-3xl cursor-pointer ${darkMode ? 'text-gray-300' : 'text-white'}`}
          onClick={handleProfileClick}
        />
        <FaCog
          className={`text-3xl cursor-pointer ${darkMode ? 'text-gray-300' : 'text-white'}`}
          onClick={handleSettingsClick}
        />
      </div>

      {/* Modal rendering for Profile and Settings */}
      {showProfile && (
        <ProfilePage onClose={handleCloseProfile} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      )}
      {showSettings && (
        <SettingsPage onClose={handleCloseSettings} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      )}
    </nav>
  );
}

export default Navbar;







