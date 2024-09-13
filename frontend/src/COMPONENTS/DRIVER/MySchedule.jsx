import React, { useState, useEffect } from 'react';

function MySchedule({ darkMode, addToHistory }) {
  // Simulated data for shifts
  const shifts = [
    {
      id: 1,
      date: '2023-10-01',
      route: 'Route A',
      time: '08:00 AM - 04:00 PM',
      bus: 'Bus 101',
      duration: 8 * 60 * 60, // 8 hours in seconds
      details: 'Detailed info about Route A and Bus 101.',
      startTime: new Date('2023-10-01T08:00:00'),
      endTime: new Date('2023-10-01T16:00:00'),
    },
    {
      id: 2,
      date: '2023-10-05',
      route: 'Route B',
      time: '09:00 AM - 05:00 PM',
      bus: 'Bus 102',
      duration: 8 * 60 * 60, // 8 hours in seconds
      details: 'Detailed info about Route B and Bus 102.',
      startTime: new Date('2023-10-05T09:00:00'),
      endTime: new Date('2023-10-05T17:00:00'),
    },
    {
      id: 3,
      date: '2023-10-12',
      route: 'Route C',
      time: '07:00 AM - 03:00 PM',
      bus: 'Bus 103',
      duration: 8 * 60 * 60, // 8 hours in seconds
      details: 'Detailed info about Route C and Bus 103.',
      startTime: new Date('2023-10-12T07:00:00'),
      endTime: new Date('2023-10-12T15:00:00'),
    },
  ];

  const [activeShiftId, setActiveShiftId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentShift, setCurrentShift] = useState(null);

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

  const confirmEndTrip = () => {
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
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">My Schedule</h2>

      {/* Display schedules as rows */}
      <div>
        {shifts.map((shift) => (
          <div key={shift.id} className="mb-4 p-4 flex justify-between items-center rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
            <div>
              <p><strong>Date:</strong> {shift.date}</p>
              <p><strong>Route:</strong> {shift.route}</p>
              <p><strong>Time:</strong> {shift.time}</p>
              <p><strong>Bus:</strong> {shift.bus}</p>
              <p><strong>Details:</strong> {shift.details}</p>

              {activeShiftId === shift.id && (
                <div className="mt-2">
                  <p>Time Elapsed: {Math.floor(timer / 3600)}h {Math.floor((timer % 3600) / 60)}m {timer % 60}s</p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end">
              <button
                onClick={() => handleStartTrip(shift)}
                disabled={activeShiftId !== null && activeShiftId !== shift.id}
                className={`px-4 py-2 mb-2 rounded-full ${
                  activeShiftId === null || activeShiftId === shift.id ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 cursor-not-allowed'
                } text-white`}
              >
                Start Trip
              </button>

              <button
                onClick={handleEndTrip}
                disabled={activeShiftId !== shift.id}
                className={`px-4 py-2 rounded-full ${
                  activeShiftId === shift.id ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 cursor-not-allowed'
                } text-white`}
              >
                End Trip
              </button>
            </div>
          </div>
        ))}
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className={`bg-white ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-lg w-80`}>
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
