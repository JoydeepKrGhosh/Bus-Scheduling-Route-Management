// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import RouteDetailsPanel from './RouteDetailsPanel';
// import StatusBar from './StatusBar';
// import ControlButtons from './ControlButtons';
// import EmergencyButton from './EmergencyButton';

// // Fix for default Leaflet marker icon not being found
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
// });

// const containerStyle = {
//   width: '100%',
//   height: '100%',
// };

// const defaultCenter = {
//   lat: 28.7041,
//   lng: 77.1025, // Default to Delhi if current position is not available
// };

// const GISNavigation = ({ darkMode }) => {
//   const [currentPosition, setCurrentPosition] = useState(null);

//   // Get the user's current location
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setCurrentPosition({ lat: latitude, lng: longitude });
//       },
//       (error) => {
//         console.error('Error getting location: ', error);
//       }
//     );
//   }, []);

//   return (
//     <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} overflow-hidden`}>
//       <StatusBar />

//       <div className="flex flex-1 flex-col md:flex-row mt-2 md:mt-4">
//         <div className="w-full md:w-1/3 lg:w-1/4 p-2">
//           <RouteDetailsPanel />
//         </div>
//         <div className="flex-1 p-2">
//           <MapContainer
//             style={containerStyle}
//             center={currentPosition || defaultCenter}
//             zoom={13}
//             scrollWheelZoom={false}
//           >
//             <TileLayer
//               url="https://maps.geoapify.com/v1/tile/dark-matter-brown/{z}/{x}/{y}.png?apiKey=38f3d26824c541c798b28f20ff36c638"
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & Geoapify'
//             />
//             {currentPosition && (
//               <Marker position={currentPosition} />
//             )}
//           </MapContainer>
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row justify-between p-4">
//         <ControlButtons />
//         <EmergencyButton />
//       </div>
//     </div>
//   );
// };

// export default GISNavigation;
 

//Main Component

//////////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import AssignRoutes from '../ADMIN/AssignRoutes';
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

const GISNavigation = () => {
  // const [routes, setRoutes] = useState([]); // All routes
  // const [selectedRoute, setSelectedRoute] = useState(null); // Selected route details
  // const [source, setSource] = useState(''); // Source destination input
  // const [destination, setDestination] = useState(''); // Final destination input

  // // Fetch all routes for selection
  // useEffect(() => {
  //   const fetchRoutes = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/api/showadminroutes/routes');
  //       const data = await response.json();
  //       setRoutes(data);
  //     } catch (error) {
  //       console.error('Error fetching routes:', error);
  //     }
  //   };

  //   fetchRoutes();
  // }, []);

  // // Handle source and destination input changes
  // const handleSourceChange = (event) => {
  //   setSource(event.target.value);
  // };

  // const handleDestinationChange = (event) => {
  //   setDestination(event.target.value);
  // };

  // // Handle save route action
  // const handleSaveRoute = () => {
  //   if (source && destination) {
  //     console.log('Route saved:', { source, destination });
  //     setSource('');
  //     setDestination('');
  //   } else {
  //     alert('Please enter both source and destination');
  //   }
  // };

  // // Check if the coordinates are valid
  // const isValidCoordinates = (coordinates) => {
  //   return Array.isArray(coordinates) && coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1]);
  // };

  // // Render the map
  // const renderMap = () => {
  //   if (!selectedRoute) {
  //     return (
  //       <div className="h-[500px] flex justify-center items-center bg-gray-200 border border-gray-300 text-gray-500">
  //         Select a route to see it on the map.
  //       </div>
  //     );
  //   }

  //   const { startPoint, endPoint, routePath, instructions } = selectedRoute;

  //   if (!isValidCoordinates(startPoint.coordinates) || !isValidCoordinates(endPoint.coordinates)) {
  //     return <div>Invalid route data. Please check the coordinates for the route.</div>;
  //   }

  //   const mapCenter = [startPoint.coordinates[1], startPoint.coordinates[0]];
  //   const polylineCoordinates = routePath.coordinates
  //     .filter((coord) => isValidCoordinates(coord))
  //     .map(([lng, lat]) => [lat, lng]);

  //   return (
  //     <MapContainer center={mapCenter} zoom={13} className="h-[500px] w-full">
  //       <TileLayer
  //         url={`https://maps.geoapify.com/v1/tile/osm-liberty/{z}/{x}/{y}.png?apiKey=38f3d26824c541c798b28f20ff36c638`}
  //         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //       />

  //       {/* Start Marker */}
  //       {isValidCoordinates(startPoint.coordinates) && (
  //         <Marker position={[startPoint.coordinates[1], startPoint.coordinates[0]]}>
  //           <Popup>Start: {startPoint.name || 'No Name'}</Popup>
  //         </Marker>
  //       )}

  //       {/* End Marker */}
  //       {isValidCoordinates(endPoint.coordinates) && (
  //         <Marker position={[endPoint.coordinates[1], endPoint.coordinates[0]]}>
  //           <Popup>End: {endPoint.name || 'No Name'}</Popup>
  //         </Marker>
  //       )}

  //       {/* Polyline for the route path */}
  //       {polylineCoordinates.length > 0 && <Polyline positions={polylineCoordinates} color="blue" />}
  //     </MapContainer>
  //   );
  // };

  // // Render turn-by-turn instructions
  // const renderInstructions = () => {
  //   if (!selectedRoute || !selectedRoute.instructions) {
  //     return null;
  //   }

  //   return (
  //     <div className="mt-5">
  //       <h3 className="font-bold">Turn-by-Turn Instructions</h3>
  //       <ul className="list-decimal">
  //         {selectedRoute.instructions.map((instruction, index) => (
  //           <li key={index}>
  //             {instruction.instruction} (Distance: {instruction.distance}m, Time: {instruction.time.toFixed(2)}s)
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  // };

  // return (
  //   <div className="flex flex-col items-center gap-5 mx-auto  max-w-[800px]">
  //     <h1 className="text-2xl font-bold pb-4">Search for Route</h1>

  //     {/* Row for source, destination, and save button */}
  //     <div className="flex flex-row items-center gap-3 w-full">
  //       {/* Source Destination Search Bar */}
  //       <div className="flex-1">
  //         <label htmlFor="source" className="font-bold block mb-2">Source Destination:</label>
  //         <input
  //           id="source"
  //           type="text"
  //           value={source}
  //           onChange={handleSourceChange}
  //           placeholder="Enter Source"
  //           className="p-2 text-lg w-full border border-gray-300 rounded"
  //         />
  //       </div>

  //       {/* Final Destination Search Bar */}
  //       <div className="flex-1">
  //         <label htmlFor="destination" className="font-bold block mb-2">Final Destination:</label>
  //         <input
  //           id="destination"
  //           type="text"
  //           value={destination}
  //           onChange={handleDestinationChange}
  //           placeholder="Enter Destination"
  //           className="p-2 text-lg w-full border border-gray-300 rounded"
  //         />
  //       </div>

  //       {/* Save Routes Button */}
  //       <button
  //         onClick={handleSaveRoute}
  //         className="mt-8 p-2 text-lg bg-green-600 text-white rounded hover:bg-green-700"
  //       >
  //         Save Route
  //       </button>
  //     </div>

  //     {/* Map display */}
  //     <div className="w-full">
  //       {renderMap()}
  //     </div>

  //     {/* Turn-by-turn instructions */}
  //     {renderInstructions()}
  //   </div>
  // );


return(
<div className='mt-20'>
  <AssignRoutes/>
  </div>
)



};

export default GISNavigation;
