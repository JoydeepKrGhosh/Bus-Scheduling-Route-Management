// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function LoginPage() {
//   const [userId, setUserId] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('Admin');
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     if (role === 'Admin') navigate('/admin');
//     else if (role === 'System Manager') navigate('/system-manager');
//     else if (role === 'Crew Member') navigate('/crew-member');
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-lg w-96">
//         <h1 className="text-2xl font-bold mb-6 text-center">DTC Employee Login</h1>
//         <input
//           type="text"
//           className="w-full mb-4 p-2 border rounded"
//           placeholder="User ID"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//         />
//         <input
//           type="password"
//           className="w-full mb-4 p-2 border rounded"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <select
//           className="w-full mb-4 p-2 border rounded"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//         >
//           <option value="Admin">Admin</option>
//           <option value="System Manager">System Manager</option>
//           <option value="Crew Member">Crew Member</option>
//         </select>
//         <button
//           className="w-full bg-blue-500 text-white p-2 rounded"
//           onClick={handleLogin}
//         >
//           Login
//         </button>
//         <div className="text-center mt-4">
//           <a href="#" className="text-blue-500">Forgot Password?</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;


///////////////////////////


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [subRole, setSubRole] = useState('');
  const [error, setError] = useState(''); // Renamed for consistency
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const minEmployeeIdLength = 6;
    const minPasswordLength = 8;

    // Validation logic with clear error messages
    const validationError = validateCredentials(employeeId, password, minEmployeeIdLength, minPasswordLength);
    if (validationError) {
      setError(validationError);
      return;
    }

    // If lengths are valid, proceed with role and sub-role matching
    if (role === 'Admin' && employeeId === 'admin000' && password === 'admin1234') {
      onLogin('Admin');
      navigate('/admin');
    } else if (role === 'Crew Member' && subRole === 'Driver' && employeeId === 'driver01' && password === 'driver123') {
      onLogin('Driver');
      navigate('/driver');
    } else if (role === 'Crew Member' && subRole === 'Conductor' && employeeId === 'conduc01' && password === 'condut123') {
      onLogin('Conductor');
      navigate('/conductor');
    } else {
      setError('Incorrect Employee ID, Password, or Role.');
    }
  };

  const validateCredentials = (employeeId, password, minEmployeeIdLength, minPasswordLength) => {
    if (employeeId.length < minEmployeeIdLength) {
      return `Employee ID must be at least ${minEmployeeIdLength} characters.`;
    }

    if (password.length < minPasswordLength) {
      return `Password must be at least ${minPasswordLength} characters.`;
    }

    return ; // No errors found
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-md">
        <div className="text-center mb-4">
          <img src="https://dtcpass.delhi.gov.in/images/DTC1.png" alt="DTC Logo" className="mx-auto w-32 h-32" />
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="employeeId" className="block text-gray-700 text-sm font-bold mb-2">
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter Employee ID"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setSubRole(''); // Reset subRole when switching between Admin and Crew Member
              }}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Admin">Admin</option>
              <option value="Crew Member">Crew Member</option>
            </select>
          </div>
          {role === 'Crew Member' && (
            <div className="mb-4">
              <label htmlFor="subRole" className="block text-gray-700 text-sm font-bold mb-2">Sub Role</label>
              <select
                id="subRole"
                value={subRole}
                onChange={(e) => setSubRole(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder='Select Sub Role'
              >
                <option value="">Select Sub Role</option>
                <option value="Driver">Driver</option>
                <option value="Conductor">Conductor</option>
              </select>
            </div>
          )}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition duration-200"
          >
            Login
          </button>
          <div className="text-right mt-2">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-800">Forgot Password?</a>
          </div>
        </form>
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => navigate('/')}>
          X
        </button>
      </div>
    </div>
  );
}

export default LoginPage;


////////////////


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const LoginPage = () => {
//   const [employeeId, setEmployeeId] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('Admin');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     // Hardcoded credentials
//     const credentials = {
//       admin123: { password: 'adminpass', role: 'Admin' },
//       manager123: { password: 'managerpass', role: 'System Manager' },
//       crew123: { password: 'crewpass', role: 'Crew Member' },
//     };

//     if (
//       credentials[employeeId] &&
//       credentials[employeeId].password === password &&
//       credentials[employeeId].role === role
//     ) {
//       // Navigate to the respective dashboard
//       switch (role) {
//         case 'Admin':
//           navigate('/admin-dashboard');
//           break;
//         case 'System Manager':
//           navigate('/system-manager-dashboard');
//           break;
//         case 'Crew Member':
//           navigate('/crew-member-dashboard');
//           break;
//         default:
//           setError('Invalid role');
//           break;
//       }
//     } else {
//       setError('Invalid Employee ID or Password');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
//         <div className="text-center mb-6">
//           <h1 className="text-3xl font-bold">DTC Employee Login</h1>
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Employee ID</label>
//           <input
//             type="text"
//             value={employeeId}
//             onChange={(e) => setEmployeeId(e.target.value)}
//             placeholder="Enter Employee ID"
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter Password"
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Role</label>
//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           >
//             <option value="Admin">Admin</option>
//             <option value="System Manager">System Manager</option>
//             <option value="Crew Member">Crew Member</option>
//           </select>
//         </div>
//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//         <div className="flex justify-between items-center">
//           <button
//             onClick={handleLogin}
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//           >
//             Login
//           </button>
//           <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
//         </div>
//       </div>
//       <button
//         className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         onClick={() => alert('Login Page Closed')}
//       >
//         &times;
//       </button>
//     </div>
//   );
// };

// export default LoginPage;

