import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './COMPONENTS/LoginPage';
import AdminDashboard from './COMPONENTS/AdminDashboard';
import SystemManagerDashboard from './COMPONENTS/SystemManagerDashboard';
import CrewMemberDashboard from './COMPONENTS/CrewMemberDashboard';
import ProfilePage from './COMPONENTS/ProfilePage';

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
          path="/system-manager"
          element={isAuthenticated && role === 'System Manager' ? <SystemManagerDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/crew-member"
          element={isAuthenticated && role === 'Crew Member' ? <CrewMemberDashboard /> : <Navigate to="/" />}
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
