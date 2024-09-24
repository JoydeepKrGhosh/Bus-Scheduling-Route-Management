import { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Modal from './Modal'; // Ensure the correct file path

function ActiveBuses({ darkMode, handleCardClick }) {
  const [buses, setBuses] = useState([]); // Default to an empty array
  const [showModal, setShowModal] = useState(false);

  // Fetch buses from the backend when the component mounts
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/busdata/getbuses');
        if (Array.isArray(response.data)) {
          setBuses(response.data);
        } else {
          setBuses([]); // Set buses to an empty array if the response is not an array
        }
      } catch (error) {
        console.error('Error fetching buses:', error);
        setBuses([]); // In case of error, fall back to an empty array
      }
    };
    fetchBuses();
  }, [buses]);

  const handleAddBus = () => {
    setShowModal(true);
  };

  const handleFormSubmit = async (newBus) => {
    try {
      // Ensure correct API endpoint
      await axios.post('http://localhost:5000/api/busdata/postbus', newBus); // Replace with your backend POST request
      setBuses([...buses, newBus]); // Add the new bus to the UI
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error('Error saving bus:', error);
    }
  };

  return (
    <div className={`p-4 md:p-8 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} mt-4`}>
      <div className="mb-8">
        <button
          className={`px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-700 hover:bg-gray-100 hover:text-black'} text-white rounded flex items-center transition`}
          onClick={() => handleCardClick('overview')}
        >
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Active Buses</h2>

      <div className="mt-6 flex justify-center">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          onClick={handleAddBus}
        >
          Add Bus
        </button>
      </div>

      <div className="overflow-x-auto mt-6">
        {buses.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-300 text-gray-700">
              <tr>
                <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-base">Bus Number</th>
                <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-base">Capacity</th>
                <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-base">Status</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus, index) => (
                <tr
                  key={bus.id || index} // Ensure unique key (either bus.id or fallback to index)
                  className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'} hover:bg-gray-200 transition-colors`}
                >
                  <td className="py-3 md:py-6 px-2 md:px-4 text-center text-xs md:text-base">{bus.busNumber}</td>
                  <td className="py-3 md:py-6 px-2 md:px-4 text-center text-xs md:text-base">{bus.capacity}</td>
                  <td className="py-3 md:py-6 px-2 md:px-4 text-center text-xs md:text-base">{bus.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center mt-6 text-gray-500">No buses available at the moment.</p>
        )}
      </div>

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default ActiveBuses;
