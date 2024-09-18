

// import React, { useState } from 'react';
// import BusRouteMap from './BusRouteMap'; // Import the new BusRouteMap component
// import { FaBus, FaEdit, FaTrashAlt } from 'react-icons/fa';
// import Modal from './Modal'; // A reusable modal component for adding/editing buses

// function ActiveBuses({ darkMode, handleCardClick }) {
//   const [buses, setBuses] = useState([
//     { id: 'DTC-101', type: 'AC', currentRoute: 'Route 1', progress: 100, location: 'Destination', capacity: 50, status: 'Available' },
//     { id: 'DTC-102', type: 'Non-AC', currentRoute: 'Route 2', progress: 0, location: 'Bus Stand', capacity: 40, status: 'Available' },
//     { id: 'DTC-103', type: 'AC', currentRoute: 'Route 3', progress: 50, location: 'En Route', capacity: 60, status: 'Available' },
//     { id: 'DTC-104', type: 'Non-AC', currentRoute: 'Route 4', progress: 20, location: 'Bus Stand', capacity: 55, status: 'Available' },
//   ]);

//   const [selectedBus, setSelectedBus] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [busToEdit, setBusToEdit] = useState(null);

//   const handleProgressClick = (bus) => {
//     setSelectedBus(bus); // Update the selected bus for showing the route map
//   };

//   const getBusPositionStyle = (progress) => {
//     return { left: `calc(${progress}% - 10px)` }; // Keep bus icon within progress bar
//   };

//   const getProgressBarColor = (bus) => {
//     if (bus.location === 'Bus Stand') return 'bg-red-500';
//     if (bus.location === 'Destination') return 'bg-green-500';
//     if (bus.location === 'En Route') return 'bg-orange-500';
//     return 'bg-gray-300';
//   };

//   const handleAddBus = () => {
//     setShowModal(true);
//     setIsEditing(false);
//   };

//   const handleEditBus = (bus) => {
//     setBusToEdit(bus);
//     setIsEditing(true);
//     setShowModal(true);
//   };

//   const handleDeleteBus = (busId) => {
//     setBuses(buses.filter((bus) => bus.id !== busId));
//   };

//   const handleFormSubmit = (newBus) => {
//     if (isEditing) {
//       setBuses(buses.map((bus) => (bus.id === busToEdit.id ? newBus : bus)));
//     } else {
//       setBuses([...buses, newBus]);
//     }
//     setShowModal(false);
//     setBusToEdit(null);
//   };

//   return (
//     <div className={`p-4 md:p-8 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} mt-4`}>
//       <button
//         onClick={() => handleCardClick('overview')}
//         className="mb-4 text-blue-500 hover:underline"
//       >
//         Back to Dashboard
//       </button>
//       <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Manage Buses</h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//           <thead className="bg-gray-300 text-gray-700">
//             <tr>
//               <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-base">Bus Number</th>
//               <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-base">Progress</th>
//               <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-base">Capacity</th>
//               <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-base">Status</th>
//               <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-base">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {buses.map((bus, index) => (
//               <tr
//                 key={bus.id}
//                 className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'} hover:bg-gray-200 transition-colors`}
//               >
//                 <td className="py-3 md:py-6 px-2 md:px-4 text-center text-xs md:text-base">{bus.id}</td>
//                 <td className="py-3 md:py-6 px-2 md:px-4 text-center">
//                   <div
//                     className="relative w-full max-w-xs mx-auto cursor-pointer"
//                     onClick={() => handleProgressClick(bus)}
//                   >
//                     {/* Progress Bar */}
//                     <div className="relative h-2 bg-gray-300 rounded-full">
//                       {/* Progress Track */}
//                       <div
//                         className={`absolute top-0 left-0 h-2 rounded-full ${getProgressBarColor(bus)}`}
//                         style={{ width: `${bus.progress}%` }}
//                       ></div>
//                       {/* Bus Icon */}
//                       <FaBus
//                         className="absolute text-blue-500 -top-5 md:-top-6"
//                         style={getBusPositionStyle(bus.progress)}
//                       />
//                       {/* Status Circles (Embedded in Bar) */}
//                       <div className="absolute left-0 w-full h-full flex justify-between items-center">
//                         <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-gray-500"></div>
//                         <div
//                           className={`w-2 h-2 md:w-4 md:h-4 rounded-full ${bus.progress >= 50 ? 'bg-gray-500' : 'bg-gray-400'}`}
//                         ></div>
//                         <div
//                           className={`w-2 h-2 md:w-4 md:h-4 rounded-full ${bus.progress === 100 ? 'bg-gray-500' : 'bg-gray-400'}`}
//                         ></div>
//                       </div>
//                     </div>
//                     {/* Status Labels */}
//                     <div className="flex justify-between mt-2 md:mt-4 text-xs md:text-sm">
//                       <span>Start</span>
//                       <span>En Route</span>
//                       <span>End</span>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="py-3 md:py-6 px-2 md:px-4 text-center text-xs md:text-base">{bus.capacity}</td>
//                 <td className="py-3 md:py-6 px-2 md:px-4 text-center text-xs md:text-base">{bus.status}</td>
//                 <td className="py-3 md:py-6 px-2 md:px-4 text-center">
//                   <button onClick={() => handleEditBus(bus)} className="mr-2 text-blue-500">
//                     <FaEdit />
//                   </button>
//                   <button onClick={() => handleDeleteBus(bus.id)} className="text-red-500">
//                     <FaTrashAlt />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="mt-6 flex justify-end">
//         <button
//           className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
//           onClick={handleAddBus}
//         >
//           Add Bus
//         </button>
//       </div>

//       {/* Conditionally render BusRouteMap */}
//       {selectedBus && (
//         <BusRouteMap bus={selectedBus} onClose={() => setSelectedBus(null)} />
//       )}

//       {/* Modal for Add/Edit Bus */}
//       {showModal && (
//         <Modal
//           isEditing={isEditing}
//           bus={busToEdit}
//           onClose={() => setShowModal(false)}
//           onSubmit={handleFormSubmit}
//         />
//       )}
//     </div>
//   );
// }

// export default ActiveBuses;


////////////////////////////////////////////


import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests
import BusRouteMap from './BusRouteMap'; // Import the BusRouteMap component
import { FaBus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import Modal from './Modal'; // Import the Modal component

function ActiveBuses({ darkMode, handleCardClick }) {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [busToEdit, setBusToEdit] = useState(null);

  // Fetch buses from the backend when the component mounts
  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await axios.get('/api/buses'); // Replace with your backend URL
      setBuses(response.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const handleProgressClick = (bus) => {
    setSelectedBus(bus); // Update the selected bus for showing the route map
  };

  const getBusPositionStyle = (progress) => {
    return { left: `calc(${progress}% - 10px)` }; // Keep bus icon within progress bar
  };

  const getProgressBarColor = (bus) => {
    if (bus.location === 'Bus Stand') return 'bg-red-500';
    if (bus.location === 'Destination') return 'bg-green-500';
    if (bus.location === 'En Route') return 'bg-orange-500';
    return 'bg-gray-300';
  };

  const handleAddBus = () => {
    setShowModal(true);
    setIsEditing(false);
  };

  const handleEditBus = (bus) => {
    setBusToEdit(bus);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteBus = async (busId) => {
    try {
      await axios.delete(`/api/buses/${busId}`); // Call to delete the bus from backend
      setBuses(buses.filter((bus) => bus.id !== busId)); // Update UI after deletion
    } catch (error) {
      console.error('Error deleting bus:', error);
    }
  };

  const handleFormSubmit = async (newBus) => {
    try {
      if (isEditing) {
        // Update existing bus
        await axios.put(`/api/buses/${newBus.id}`, newBus); // Replace with your backend PUT request
        setBuses(buses.map((bus) => (bus.id === busToEdit.id ? newBus : bus))); // Update UI
      } else {
        // Add new bus
        await axios.post('/api/buses', newBus); // Replace with your backend POST request
        setBuses([...buses, newBus]); // Add the new bus to the UI
      }
      setShowModal(false);
      setBusToEdit(null);
    } catch (error) {
      console.error('Error saving bus:', error);
    }
  };

  return (
    <div className={`p-4 md:p-8 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} mt-4`}>
      <button
        onClick={() => handleCardClick('overview')}
        className="mb-4 text-blue-500 hover:underline"
      >
        Back to Dashboard
      </button>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Manage Buses</h2>
      <div className="mt-6 flex justify-end">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          onClick={handleAddBus}
        >
          Add Bus
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-300 text-gray-700">
            <tr>
              <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-base">Bus Number</th>
              <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-base">Progress</th>
              <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-base">Capacity</th>
              <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-base">Status</th>
              <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus, index) => (
              <tr
                key={bus.id}
                className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'} hover:bg-gray-200 transition-colors`}
              >
                <td className="py-3 md:py-6 px-2 md:px-4 text-center text-xs md:text-base">{bus.id}</td>
                <td className="py-3 md:py-6 px-2 md:px-4 text-center">
                  <div
                    className="relative w-full max-w-xs mx-auto cursor-pointer"
                    onClick={() => handleProgressClick(bus)}
                  >
                    <div className="relative h-2 bg-gray-300 rounded-full">
                      <div
                        className={`absolute top-0 left-0 h-2 rounded-full ${getProgressBarColor(bus)}`}
                        style={{ width: `${bus.progress}%` }}
                      ></div>
                      <FaBus
                        className="absolute text-blue-500 -top-5 md:-top-6"
                        style={getBusPositionStyle(bus.progress)}
                      />
                      <div className="absolute left-0 w-full h-full flex justify-between items-center">
                        <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-gray-500"></div>
                        <div
                          className={`w-2 h-2 md:w-4 md:h-4 rounded-full ${bus.progress >= 50 ? 'bg-gray-500' : 'bg-gray-400'}`}
                        ></div>
                        <div
                          className={`w-2 h-2 md:w-4 md:h-4 rounded-full ${bus.progress === 100 ? 'bg-gray-500' : 'bg-gray-400'}`}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 md:mt-4 text-xs md:text-sm">
                      <span>Start</span>
                      <span>En Route</span>
                      <span>End</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 md:py-6 px-2 md:px-4 text-center text-xs md:text-base">{bus.capacity}</td>
                <td className="py-3 md:py-6 px-2 md:px-4 text-center text-xs md:text-base">{bus.status}</td>
                <td className="py-3 md:py-6 px-2 md:px-4 text-center">
                  <button onClick={() => handleEditBus(bus)} className="mr-2 text-blue-500">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteBus(bus.id)} className="text-red-500">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {selectedBus && (
        <BusRouteMap bus={selectedBus} onClose={() => setSelectedBus(null)} />
      )}

      {showModal && (
        <Modal
          isEditing={isEditing}
          bus={busToEdit}
          onClose={() => setShowModal(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default ActiveBuses;
``
