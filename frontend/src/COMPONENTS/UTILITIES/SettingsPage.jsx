import React from 'react';
import { FaTimes } from 'react-icons/fa';

function SettingsPage({ onClose, toggleDarkMode, darkMode }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      {/* Conditionally applying dark mode classes */}
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg relative border-l-8 border-r-8 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-orange-500'}`}>
        <FaTimes 
          className={`absolute top-4 right-4 cursor-pointer transition-colors ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={onClose} 
        />

        <h2 className={`text-2xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-black'}`}>Settings</h2>
        
        <ul className="list-disc pl-5">
          <li className="mb-3">
            <button 
              className={`px-4 py-2 rounded-full shadow-sm transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`} 
              onClick={toggleDarkMode}
            >
              Toggle Dark Mode: {darkMode ? 'On' : 'Off'}
            </button>
          </li>
          <li className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Option 2</li>
          <li className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Option 3</li>
        </ul>
      </div>
    </div>
  );
}

export default SettingsPage;


