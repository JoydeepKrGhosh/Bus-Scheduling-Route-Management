// import React, { createContext, useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   const login = () => setIsAuthenticated(true);
//   const logout = () => {
//     setIsAuthenticated(false);
//     navigate('/login'); // Redirect to login page after logging out
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
