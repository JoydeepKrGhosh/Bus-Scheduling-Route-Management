import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment'; // Import moment.js for formatting date and time

const TodaySchedule = ({ darkMode, handleCardClick }) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend API
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/showadmintrips/gettrips?selectedDate=2024-09-20'); // Replace with your API endpoint
        setScheduleData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching schedule data.');
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 ">
        <button
          className={`px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-700 hover:bg-gray-100 hover:text-black'} text-white rounded flex items-center transition`}
          onClick={() => handleCardClick('overview')}
        >
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center">Today's Schedule</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left text-sm uppercase">
              <th className="py-3 px-6">Driver Name</th>
              <th className="py-3 px-6">Conductor Name</th>
              <th className="py-3 px-6">Bus Number</th>
              <th className="py-3 px-6">Start Point</th>
              <th className="py-3 px-6">End Point</th>
              <th className="py-3 px-6">Scheduled Start</th>
              <th className="py-3 px-6">Actual Start</th>
              <th className="py-3 px-6">Scheduled End</th>
              <th className="py-3 px-6">Actual End</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((schedule, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                } text-gray-700 text-sm`}
              >
                <td className="py-3 px-6">{schedule.driverName}</td>
                <td className="py-3 px-6">{schedule.conductorName}</td>
                <td className="py-3 px-6">{schedule.busNumber}</td>
                <td className="py-3 px-6">{schedule.startPointName}</td>
                <td className="py-3 px-6">{schedule.endPointName}</td>
                <td className="py-3 px-6">
                  {moment(schedule.scheduledStartTime).format('MMMM Do YYYY, h:mm A')} {/* Format scheduled start time */}
                </td>
                <td className="py-3 px-6">
                  {schedule.actualStartTime
                    ? moment(schedule.actualStartTime).format('MMMM Do YYYY, h:mm A')  // If actual start time exists, format it
                    : 'N/A'}
                </td>
                <td className="py-3 px-6">
                  {moment(schedule.scheduledEndTime).format('MMMM Do YYYY, h:mm A')} {/* Format scheduled end time */}
                </td>
                <td className="py-3 px-6">
                  {schedule.actualEndTime
                    ? moment(schedule.actualEndTime).format('MMMM Do YYYY, h:mm A')  // If actual end time exists, format it
                    : 'N/A'}
                </td>
                <td className="py-3 px-6">{schedule.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodaySchedule;

