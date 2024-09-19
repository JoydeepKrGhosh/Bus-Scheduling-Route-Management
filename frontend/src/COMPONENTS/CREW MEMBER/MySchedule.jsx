import React, { useState, useEffect } from 'react';
import TicketModal from '../CONDUCTOR/TicketModal';

function MySchedule({ darkMode, addToHistory }) {
  const [shifts, setShifts] = useState([]);
  const [activeShiftId, setActiveShiftId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentShift, setCurrentShift] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fetch data from API
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/showdriverconductortrips/crewschedule/driver/66e44e662d2666edd9ca21ae?selectedDate=2024-09-19'); // Replace with your actual API endpoint

        // Check for valid JSON response
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }

        const data = await response.json();
        
        // Log the API response for debugging purposes
        console.log('API Response:', data);

        // Process the API data
        const shiftsFromAPI = data.map((shift, index) => {
          const startTime = new Date(shift.startTime);

          return {
            id: index + 1, // Unique ID for each shift
            date: startTime.toLocaleDateString(),
            route: `${shift.startPointName} - ${shift.endPointName}`,
            time: startTime.toLocaleTimeString(),
            bus: shift.busNumber || 'Unknown Bus',
            duration: 8 * 60 * 60, // Assuming 8 hours
            details: `Driver: ${shift.driverName || 'Unknown'}, Conductor: ${shift.conductorName || 'Unknown'}`,
            startTime: startTime,
            endTime: new Date(startTime.getTime() + 8 * 60 * 60 * 1000), // Assuming trip lasts 8 hours
          };
        });

        setShifts(shiftsFromAPI);
      } catch (error) {
        console.error('Error fetching shift data:', error);
      }
    };

    fetchShifts();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isTimerRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const handleStartTrip = (shift) => {
    setActiveShiftId(shift.id);
    setCurrentShift(shift);
    setIsTimerRunning(true);
  };

  const handleEndTrip = () => {
    setIsTimerRunning(false);
    setShowConfirmation(true);
  };

  const handleTicketSubmit = (data) => {
    setTicketData([...ticketData, data]);
  };

  const confirmEndTrip = () => {
    openModal();
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);
    const seconds = timer % 60;
    const formattedTime = `${hours}h ${minutes}m ${seconds}s`;

    const activeShift = currentShift;

    if (activeShift) {
      const timeTaken = timer;
      const remainder = activeShift.duration - timeTaken;
      const shiftEndTime = activeShift.endTime;
      const currentTime = new Date();
      const earlyOrLate = currentTime < shiftEndTime ? 'Ended Early' : 'Ended Late';
      const timeDifference = Math.abs((currentTime - shiftEndTime) / 1000); // in seconds
      const timeDiffFormatted = `${Math.floor(timeDifference / 3600)}h ${Math.floor((timeDifference % 3600) / 60)}m`;

      const historyEntry = {
        date: activeShift.date,
        route: activeShift.route,
        bus: activeShift.bus,
        timeTaken: formattedTime,
        remainder: remainder > 0 ? `${Math.floor(remainder / 3600)}h ${Math.floor((remainder % 3600) / 60)}m left` : `${-Math.floor(remainder / 3600)}h ${-Math.floor((remainder % 3600) / 60)}m over`,
        endStatus: earlyOrLate,
        difference: timeDiffFormatted,
      };

      addToHistory(historyEntry);
    }

    setActiveShiftId(null);
    setTimer(0);
    setShowConfirmation(false);
  };

  const cancelEndTrip = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="mt-4 p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-4">My Schedule</h2>

      {/* Display schedules as rows */}
      <div className="space-y-4">
        {shifts.map((shift) => (
          <div key={shift.id} className="p-4 flex flex-col sm:flex-row justify-between items-start rounded-lg shadow-lg bg-gray-100 dark:bg-gray-100">
            <div className="flex-1">
              <p><strong>Date:</strong> {shift.date || 'Invalid Date'}</p>
              <p><strong>Route:</strong> {shift.route || 'Route not available'}</p>
              <p><strong>Time:</strong> {shift.time || 'Invalid Time'}</p>
              <p><strong>Bus:</strong> {shift.bus || 'Unknown Bus'}</p>
              <p><strong>Details:</strong> {shift.details || 'No details available'}</p>

              {activeShiftId === shift.id && (
                <div className="mt-2">
                  <p>Time Elapsed: {Math.floor(timer / 3600)}h {Math.floor((timer % 3600) / 60)}m {timer % 60}s</p>
                </div>
              )}
            </div>

            <div className="mt-4 sm:mt-0 flex flex-col items-center sm:items-end space-y-2">
              <button
                onClick={() => handleStartTrip(shift)}
                disabled={activeShiftId !== null && activeShiftId !== shift.id}
                className={`px-4 py-2 rounded-full ${activeShiftId === null || activeShiftId === shift.id ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 cursor-not-allowed'} text-white`}
              >
                Start Trip
              </button>

              <button
                onClick={handleEndTrip}
                disabled={activeShiftId !== shift.id}
                className={`px-4 py-2 rounded-full ${activeShiftId === shift.id ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 cursor-not-allowed'} text-white`}
              >
                End Trip
              </button>
              <TicketModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleTicketSubmit} />
            </div>
          </div>
        ))}
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className={`bg-white ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-lg w-11/12 sm:w-80`}>
            <h3 className="text-xl font-bold mb-4">Confirm Trip End</h3>
            <p>Do you want to save this trip to your history?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                onClick={confirmEndTrip}
              >
                OK
              </button>
            
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
                onClick={cancelEndTrip}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MySchedule;
