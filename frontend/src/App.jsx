import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './COMPONENTS/LOGIN_PAGE/LoginPage';
import AdminDashboard from './COMPONENTS/ADMIN/AdminDashboard';
import ConductorDashboard from './COMPONENTS/CONDUCTOR/ConductorDashboard'; // Updated to Conductor Dashboard
import DriverDashboard from './COMPONENTS/DRIVER/DriverDashboard'; // Import Driver Dashboard
import ProfilePage from './COMPONENTS/UTILITIES/ProfilePage';

function App() {
  const [role, setRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (userRole) => {
    setRole(userRole);
    setIsAuthenticated(true); // Set the user as authenticated
  };

  const handleLogout = () => {
    console.log("Logging out..."); // Debug log
    setRole(''); 
    setIsAuthenticated(false); 
  };

  // Watch for changes in role and isAuthenticated and log them
  useEffect(() => {
    console.log("Role after logout:", role);
    console.log("IsAuthenticated after logout:", isAuthenticated);
  }, [role, isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/admin"
          element={isAuthenticated && role === 'Admin' ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/conductor"
          element={isAuthenticated && role === 'Conductor' ? <ConductorDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/driver"
          element={isAuthenticated && role === 'Driver' ? <DriverDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage onClose={() => {}} handleLogout={handleLogout} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;




// import React from 'react';
// import BusRouteAnimation from './COMPONENTS/BusRouteAnimation';
// import BusRouteDiagram from './COMPONENTS/BusRouteDiagram';

// function App() {
//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <BusRouteAnimation />
//       <BusRouteDiagram/>
//     </div>
//   );
// }

// export default App;