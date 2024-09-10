import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDetailsPage = ({ user }) => {
  const [timeSlot, setTimeSlot] = useState('');
  const [busId, setBusId] = useState('');
  const navigate = useNavigate();

  const handleSave = () => {
    // Logic to save details and redirect to GPS page
    console.log({ user, timeSlot, busId });
    // Redirect to GPS page
    navigate('/gps');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[70%] h-[70%]">
        <h2 className="text-2xl font-semibold mb-6">User Details</h2>
        <div className="mb-4">
          <p><strong>User ID:</strong> {user.userId}</p>
          <p><strong>Post:</strong> {user.post}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Select Time Slot</label>
          <input
            type="time"
            className="w-full p-2 border border-gray-300 rounded"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Bus ID</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white p-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default UserDetailsPage;
