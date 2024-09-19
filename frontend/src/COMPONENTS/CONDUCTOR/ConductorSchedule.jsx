import React, { useState } from 'react';
import { FaClock } from 'react-icons/fa';
import MySchedule from '../CREW MEMBER/MySchedule'; // Import MySchedule component

function ConductorSchedule({ darkMode, handleCardClick,  addToHistory }) {
  const [schedules, setSchedules] = useState([
    { id: 'Shift-001', duty: 'Morning Shift', progress: 25, status: 'En Route', startTime: '6:00 AM', endTime: '12:00 PM' },
    { id: 'Shift-002', duty: 'Break', progress: 50, status: 'On Break', startTime: '12:00 PM', endTime: '1:00 PM' },
    { id: 'Shift-003', duty: 'Afternoon Shift', progress: 75, status: 'En Route', startTime: '1:00 PM', endTime: '6:00 PM' },
    { id: 'Shift-004', duty: 'End of Day', progress: 100, status: 'Completed', startTime: '6:00 PM', endTime: 'End of Shift' },
  ]);

  const [selectedSchedule, setSelectedSchedule] = useState(null); // To track the selected schedule
  const [tripHistory, setTripHistory] = useState([]); // To store history of trips
  //  const [history, setHistory] = useState([]);

   const handleAddTrip = (historyEntry) => {
    // Call the parent's callback function to add the multiple trip data to the history
    addToHistory(historyEntry);
  };
  
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

  // Handle row click and set the selected schedule
  const handleRowClick = (schedule) => {
    setSelectedSchedule(schedule); // Set the clicked schedule
  };

  // Callback function to add trip to history
  const handleEndTrip = (trip) => {
    setTripHistory((prevHistory) => [...prevHistory, trip]); // Append trip to history
    setSelectedSchedule(null); // Go back to the schedule list after ending the trip
  };

  // If a schedule is selected, render the MySchedule component
  if (selectedSchedule) {
    return <MySchedule darkMode={darkMode} addToHistory={handleAddTrip} />;
  }

  return (
    <div
      className={`p-6 md:p-12 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} flex-grow`}
      style={{ width: '100%', height: '100%' }}
    >
      <button
        onClick={() => handleCardClick('dashboard')}
        className="mb-4 text-blue-500 hover:underline"
      >
        Back to Dashboard
    
      </button>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Conductor Schedule</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-300 text-gray-700">
            <tr>
              <th className="py-3 px-2 md:px-4 text-left text-sm md:text-base">Shift ID</th>
              <th className="py-3 px-2 md:px-4 text-left text-sm md:text-base">Duty</th>
              <th className="py-3 px-2 md:px-4 text-left text-sm md:text-base">Start Time</th>
              <th className="py-3 px-2 md:px-4 text-left text-sm md:text-base">End Time</th>
              <th className="py-3 px-2 md:px-4 text-center text-sm md:text-base">Progress</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, index) => (
              <tr
                key={schedule.id}
                className={`${index % 2 === 0 ? 'bg-white-100' : 'bg-gray-50'} hover:bg-gray-200 transition-colors cursor-pointer`}
                onClick={() => handleRowClick(schedule)} // Set the selected schedule on row click
              >
                <td className="py-4 px-2 md:px-4 text-sm md:text-base">{schedule.id}</td>
                <td className="py-4 px-2 md:px-4 text-sm md:text-base">{schedule.duty}</td>
                <td className="py-4 px-2 md:px-4 text-sm md:text-base">{schedule.startTime}</td>
                <td className="py-4 px-2 md:px-4 text-sm md:text-base">{schedule.endTime}</td>
                <td className="py-4 px-2 md:px-4 text-center text-sm md:text-base">
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
                    <div className="flex justify-between mt-2 text-xs md:text-sm">
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

      {/* Trip History Section */}
      {tripHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Trip History</h3>
          <ul className="list-disc list-inside">
            {tripHistory.map((trip, index) => (
              <li key={index} className="mb-2">
                <strong>{trip.duty}:</strong> Started at {trip.startTime}, Ended at {trip.endTime} (Duration: {trip.duration} minutes)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ConductorSchedule;