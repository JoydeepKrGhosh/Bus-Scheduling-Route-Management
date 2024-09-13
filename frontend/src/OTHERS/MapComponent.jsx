// import React, { useState, useEffect } from 'react';
// import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
// import { FaSearchLocation } from 'react-icons/fa';

// const mapContainerStyle = {
//   width: '100%',
//   height: '500px',
// };

// const MapComponent = () => {
//   const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         setCurrentLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       });
//     }
//   }, []);

//   return (
//     <div className="mt-8">
//       <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search for a place"
//             className="absolute top-2 left-2 w-1/2 px-4 py-2 bg-white shadow-md rounded-md"
//           />
//           <GoogleMap
//             mapContainerStyle={mapContainerStyle}
//             center={currentLocation}
//             zoom={14}
//           >
//             <Marker
//               position={currentLocation}
//               icon={{
//                 url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
//               }}
//             />
//           </GoogleMap>
//         </div>
//       </LoadScript>
//     </div>
//   );
// };

// export default MapComponent;


///////////////////////////////

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Custom icon for the current location
const currentLocationIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapComponent() {
  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);

  useEffect(() => {
    // Watch the user's position instead of just getting it once
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (err) => {
        console.error('Error retrieving location:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // Wait up to 10 seconds to get a location
        maximumAge: 0,
      }
    );

    // Clear the watch when the component is unmounted
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setSearchedLocation([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const MapResetCenter = ({ center }) => {
    const map = useMap();
    if (center) {
      map.setView(center, map.getZoom());
    }
    return null;
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      {/* Search Bar */}
      <div className="w-full p-4 bg-white shadow-md flex justify-left">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter destination..."
          className="p-2 border border-gray-300 rounded-l w-1/2"
        />
        <button onClick={handleSearch} className="bg-orange-500 text-white p-2 rounded-r">
          Search
        </button>
      </div>

      {/* Map */}
      <div className="flex-grow">
        {position ? (
          <MapContainer center={position} zoom={13} className="w-full h-full object-cover">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} icon={currentLocationIcon} />
            {searchedLocation && <Marker position={searchedLocation} icon={currentLocationIcon} />}
            <MapResetCenter center={searchedLocation || position} />
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Loading your location...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapComponent;








