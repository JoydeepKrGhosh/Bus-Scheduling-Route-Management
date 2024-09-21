import React, { useState, useEffect } from 'react';
import TicketCollection from './TicketCollection';

function MySchedule({ darkMode, addToHistory }) {
  const [shifts, setShifts] = useState([]);
  const [activeShiftTime, setActiveShiftTime] = useState(null); // Active shift time for which the trip is running
  const [timer, setTimer] = useState(0); // Timer for the active trip
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Status of timer
  const [showConfirmation, setShowConfirmation] = useState(false); // End trip confirmation
  const [currentShift, setCurrentShift] = useState(null); // Stores details of the active shift
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [ticketData, setTicketData] = useState([]); // Ticket collection data

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch data from API
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/showdriverconductortrips/crewschedule/driver/66e44e662d2666edd9ca21ae?selectedDate=2024-09-20');
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }

        const data = await response.json();
        const shiftsFromAPI = data.map((shift) => {
          const scheduledStartTime = new Date(shift.scheduledStartTime);
          const scheduledEndTime = new Date(shift.scheduledEndTime);
          const actualStartTime = shift.actualStartTime ? new Date(shift.actualStartTime) : null;
          const actualEndTime = shift.actualEndTime ? new Date(shift.actualEndTime) : null;

          return {
            time: scheduledStartTime.toLocaleTimeString(),
            date: scheduledStartTime.toLocaleDateString(),
            route: `${shift.startPointName} - ${shift.endPointName}`,
            bus: shift.busNumber || 'Unknown Bus',
            duration: (scheduledEndTime - scheduledStartTime) / 1000, // Duration in seconds
            details: `Driver: ${shift.driverName || 'Unknown'}, Conductor: ${shift.conductorName || 'Unknown'}`,
            scheduledStartTime,
            scheduledEndTime,
            actualStartTime,
            actualEndTime,
            status: shift.status || 'unknown',
          };
        });

        setShifts(shiftsFromAPI);
      } catch (error) {
        console.error('Error fetching shift data:', error);
      }
    };

    fetchShifts();
  }, []);

  // Handle timer for the active shift
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

  // Start the trip for the selected shift
  const handleStartTrip = (shift) => {
    console.log(`Starting trip for shift at time ${shift.time}`);
    setActiveShiftTime(shift.time); // Set active shift based on time
    setCurrentShift(shift); // Store current shift
    setIsTimerRunning(true); // Start timer
    setTimer(0); // Reset timer for new shift
  };

  // End the trip
  const handleEndTrip = () => {
    console.log(`Ending trip for shift at time ${activeShiftTime}`);
    setIsTimerRunning(false);
    setShowConfirmation(true); // Show end trip confirmation
  };

  // Confirm end trip (opens ticket collection modal)
  const confirmEndTrip = () => {
    console.log(`Confirming trip end for shift at time ${activeShiftTime}`);
    openModal(); // Open ticket collection modal
  };

  // Cancel trip end
  const cancelEndTrip = () => {
    console.log('Trip end cancelled');
    setShowConfirmation(false); // Close confirmation
  };

  // Handle ticket submission
  const handleTicketSubmit = (data) => {
    console.log('Submitting ticket data', data);
    setTicketData([...ticketData, data]); // Add new ticket data
    // Reset state to allow starting a new trip
    setActiveShiftTime(null);
    setTimer(0);
    setShowConfirmation(false);
    closeModal(); // Close modal after submission
  };

  return (
    <div className="mt-4 p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-4">My Schedule</h2>

      {/* Display schedules as rows */}
      <div className="space-y-4">
        {shifts.map((shift) => (
          <div key={shift.time} className="p-4 flex flex-col sm:flex-row justify-between items-start rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
            <div className="flex-1">
              <p><strong>Date:</strong> {shift.date || 'Invalid Date'}</p>
              <p><strong>Route:</strong> {shift.route || 'Route not available'}</p>
              <p><strong>Time:</strong> {shift.time || 'Invalid Time'}</p>
              <p><strong>Bus:</strong> {shift.bus || 'Unknown Bus'}</p>
              <p><strong>Details:</strong> {shift.details || 'No details available'}</p>

              {/* Display time only for the active shift */}
              {activeShiftTime === shift.time && (
                <div className="mt-2">
                  <p>Time Elapsed: {Math.floor(timer / 3600)}h {Math.floor((timer % 3600) / 60)}m {timer % 60}s</p>
                </div>
              )}
            </div>

            <div className="mt-4 sm:mt-0 flex flex-col items-center sm:items-end space-y-2">
              <button
                onClick={() => handleStartTrip(shift)}
                disabled={activeShiftTime !== null && activeShiftTime !== shift.time} // Disable all other buttons while a trip is active
                className={`px-4 py-2 rounded-full ${activeShiftTime === null || activeShiftTime === shift.time ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 cursor-not-allowed'} text-white`}
              >
                Start Trip
              </button>

              <button
                onClick={handleEndTrip}
                disabled={activeShiftTime !== shift.time} // Only enable the end button for the active shift
                className={`px-4 py-2 rounded-full ${activeShiftTime === shift.time ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 cursor-not-allowed'} text-white`}
              >
                End Trip
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* End trip confirmation modal */}
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

      {/* Ticket collection modal */}
      <TicketCollection
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleTicketSubmit}
        busId={currentShift ? currentShift.bus : 'Unknown Bus'}
      />
    </div>
  );
}

export default MySchedule;
