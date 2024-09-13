import React, { useState } from 'react';
import { FaClock } from 'react-icons/fa';

function ConductorSchedule({ darkMode, handleCardClick }) {
  const [schedules, setSchedules] = useState([
    { id: 'Shift-001', duty: 'Morning Shift', progress: 25, status: 'En Route', startTime: '6:00 AM', endTime: '12:00 PM' },
    { id: 'Shift-002', duty: 'Break', progress: 50, status: 'On Break', startTime: '12:00 PM', endTime: '1:00 PM' },
    { id: 'Shift-003', duty: 'Afternoon Shift', progress: 75, status: 'En Route', startTime: '1:00 PM', endTime: '6:00 PM' },
    { id: 'Shift-004', duty: 'End of Day', progress: 100, status: 'Completed', startTime: '6:00 PM', endTime: 'End of Shift' },
  ]);

  const getProgressBarColor = (status) => {
    switch (status) {
      case 'En Route':
        return 'bg-orange-500';
      case 'On Break':
        return 'bg-blue-500';
      case 'Completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getPositionStyle = (progress) => {
    return { left: `calc(${progress}% - 12px)` };
  };

  return (
    <div
      className={`p-12 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} flex-grow`}
      style={{ width: '100%', height: '100%' }}
    >
      <button
        onClick={() => handleCardClick('overview')}
        className="mb-4 text-blue-500 hover:underline"
      >
        Back to Dashboard
      </button>
      <h2 className="text-3xl font-bold mb-6">Conductor Schedule</h2>

      <div className="overflow-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-300 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Shift ID</th>
              <th className="py-3 px-4 text-left">Duty</th>
              <th className="py-3 px-4 text-left">Start Time</th>
              <th className="py-3 px-4 text-left">End Time</th>
              <th className="py-3 px-4 text-center">Progress</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, index) => (
              <tr
                key={schedule.id}
                className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'} hover:bg-gray-200 transition-colors`}
              >
                <td className="py-6 px-4">{schedule.id}</td>
                <td className="py-6 px-4">{schedule.duty}</td>
                <td className="py-6 px-4">{schedule.startTime}</td>
                <td className="py-6 px-4">{schedule.endTime}</td>
                <td className="py-6 px-4 text-center">
                  <div className="relative w-full max-w-lg mx-auto">
                    <div className="relative h-2 bg-gray-300 rounded-full">
                      <div
                        className={`absolute top-0 left-0 h-2 rounded-full ${getProgressBarColor(schedule.status)}`}
                        style={{ width: `${schedule.progress}%` }}
                      ></div>
                      <FaClock
                        className="absolute text-blue-500 -top-5"
                        style={getPositionStyle(schedule.progress)}
                      />
                      <div className="absolute left-0 w-full h-full flex justify-between items-center">
                        <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                        <div className="w-4 h-4 rounded-full"></div>
                        <div className="w-4 h-4 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4 text-xs">
                      <span>Start</span>
                      <span>In Progress</span>
                      <span>End</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ConductorSchedule;
