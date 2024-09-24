// import React, { useState, useEffect } from 'react';
// import { FaArrowLeft } from 'react-icons/fa';
// import axios from 'axios';
// import moment from 'moment'; // Import moment.js for formatting date and time

// const TodaySchedule = ({ darkMode, handleCardClick }) => {
//   const [scheduleData, setScheduleData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch data from backend API
//   useEffect(() => {
//     const fetchSchedule = async () => {
//       try {
//         const response = await axios.get('https://bus-scheduling-route-management-1.onrender.com/api/showadmintrips/gettrips?selectedDate=2024-09-20'); // Replace with your API endpoint
//         setScheduleData(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Error fetching schedule data.');
//         setLoading(false);
//       }
//     };

//     fetchSchedule();
//   }, []);

//   if (loading) {
//     return <p className="text-center">Loading...</p>;
//   }

//   if (error) {
//     return <p className="text-center text-red-500">{error}</p>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8 ">
//         <button
//           className={`px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-700 hover:bg-gray-100 hover:text-black'} text-white rounded flex items-center transition`}
//           onClick={() => handleCardClick('overview')}
//         >
//           <FaArrowLeft className="mr-2" /> Back to Dashboard
//         </button>
//       </div>
//       <h2 className="text-2xl font-bold mb-6 text-center">Today's Schedule</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//           <thead>
//             <tr className="bg-gray-200 text-gray-700 text-left text-sm uppercase">
//               <th className="py-3 px-6">Driver Name</th>
//               <th className="py-3 px-6">Conductor Name</th>
//               <th className="py-3 px-6">Bus Number</th>
//               <th className="py-3 px-6">Start Point</th>
//               <th className="py-3 px-6">End Point</th>
//               <th className="py-3 px-6">Scheduled Start</th>
//               <th className="py-3 px-6">Actual Start</th>
//               <th className="py-3 px-6">Scheduled End</th>
//               <th className="py-3 px-6">Actual End</th>
//               <th className="py-3 px-6">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {scheduleData.map((schedule, index) => (
//               <tr
//                 key={index}
//                 className={`${
//                   index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
//                 } text-gray-700 text-sm`}
//               >
//                 <td className="py-3 px-6">{schedule.driverName}</td>
//                 <td className="py-3 px-6">{schedule.conductorName}</td>
//                 <td className="py-3 px-6">{schedule.busNumber}</td>
//                 <td className="py-3 px-6">{schedule.startPointName}</td>
//                 <td className="py-3 px-6">{schedule.endPointName}</td>
//                 <td className="py-3 px-6">
//                   {moment(schedule.scheduledStartTime).format('MMMM Do YYYY, h:mm A')} {/* Format scheduled start time */}
//                 </td>
//                 <td className="py-3 px-6">
//                   {schedule.actualStartTime
//                     ? moment(schedule.actualStartTime).format('MMMM Do YYYY, h:mm A')  // If actual start time exists, format it
//                     : 'N/A'}
//                 </td>
//                 <td className="py-3 px-6">
//                   {moment(schedule.scheduledEndTime).format('MMMM Do YYYY, h:mm A')} {/* Format scheduled end time */}
//                 </td>
//                 <td className="py-3 px-6">
//                   {schedule.actualEndTime
//                     ? moment(schedule.actualEndTime).format('MMMM Do YYYY, h:mm A')  // If actual end time exists, format it
//                     : 'N/A'}
//                 </td>
//                 <td className="py-3 px-6">{schedule.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TodaySchedule;

//MAIN COMPONENT

////////////////////////////////////////////////////////////////
import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';
import FilterComponent from './FilterComponent';

const TodaySchedule = ({ darkMode, handleCardClick }) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend API
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/showadmintrips/gettrips?selectedDate=2024-09-22'
        );
        setScheduleData(response.data);
        setFilteredData(response.data); // Display all data initially
        setLoading(false);
      } catch (err) {
        setError('Error fetching schedule data.');
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  // Handle filter logic
  const handleFilter = (filter) => {
    const { searchText, status } = filter;
    let filtered = scheduleData;

    // Apply search text filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((item) =>
        item.driverName.toLowerCase().includes(searchLower) ||
        item.conductorName.toLowerCase().includes(searchLower) ||
        item.busNumber.toLowerCase().includes(searchLower) ||
        item.startPointName.toLowerCase().includes(searchLower) ||
        item.endPointName.toLowerCase().includes(searchLower) ||
        item.scheduledStartTime.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }

    setFilteredData(filtered);
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-6">
        <button
          className={`px-5 py-2.5 ${
            darkMode
              ? 'bg-gradient-to-r from-black-600 to-white-600 hover:from-grey-200 hover:to-black'
              : 'bg-gradient-to-r  from-slate-500 to-black hover:from-slate-900 hover:to-slate-500'
          } text-white font-semibold rounded-lg flex items-center transition duration-300 ease-in-out transform hover:scale-105 shadow-lg`}
          onClick={() => handleCardClick('overview')}
        >
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>
      </div>
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 dark:tracking-tight">
        Today&#39;s Schedule
      </h2>

      {/* Filter component */}
      <FilterComponent onFilter={handleFilter} />

      {filteredData.length > 0 ? (
        <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white uppercase text-sm tracking-wider">
                <th className="py-4 px-6">Driver Name</th>
                <th className="py-4 px-6">Conductor Name</th>
                <th className="py-4 px-6">Bus Number</th>
                <th className="py-4 px-6">Start Point</th>
                <th className="py-4 px-6">End Point</th>
                <th className="py-4 px-6">Scheduled Start</th>
                <th className="py-4 px-6">Actual Start</th>
                <th className="py-4 px-6">Scheduled End</th>
                <th className="py-4 px-6">Actual End</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((schedule, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? 'bg-gray-50 dark:bg-gray-800'
                      : 'bg-white dark:bg-gray-900'
                  } text-gray-700 dark:text-gray-200 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 ease-in-out`}
                >
                  <td className="py-4 px-6">{schedule.driverName}</td>
                  <td className="py-4 px-6">{schedule.conductorName}</td>
                  <td className="py-4 px-6">{schedule.busNumber}</td>
                  <td className="py-4 px-6">{schedule.startPointName}</td>
                  <td className="py-4 px-6">{schedule.endPointName}</td>
                  <td className="py-4 px-6">
                    {moment(schedule.scheduledStartTime).format(
                      'MMMM Do YYYY, h:mm A'
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {schedule.actualStartTime
                      ? moment(schedule.actualStartTime).format(
                          'MMMM Do YYYY, h:mm A'
                        )
                      : 'Not started'}
                  </td>
                  <td className="py-4 px-6">
                    {moment(schedule.scheduledEndTime).format(
                      'MMMM Do YYYY, h:mm A'
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {schedule.actualEndTime
                      ? moment(schedule.actualEndTime).format(
                          'MMMM Do YYYY, h:mm A'
                        )
                      : 'Not started'}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-semibold ${
                        schedule.status === 'completed'
                          ? 'bg-green-200 text-green-800'
                          : schedule.status === 'ongoing'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {schedule.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No data found.
        </p>
      )}
    </div>
  );
};

export default TodaySchedule;
