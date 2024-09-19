import React from 'react';
import { FaBell } from 'react-icons/fa';

function Notification({ notifications, darkMode }) {
  return (
    <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} mt-16`}>
      <div className="flex items-center mb-6">
        <FaBell className={`text-4xl mr-4 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
        <h2 className="text-3xl font-bold">Notifications</h2>
      </div>
      {notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map((notification, index) => (
            <li key={index} className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notification.message}</p>
              <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{notification.time}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No new notifications</p>
      )}
    </div>
  );
}

export default Notification;
