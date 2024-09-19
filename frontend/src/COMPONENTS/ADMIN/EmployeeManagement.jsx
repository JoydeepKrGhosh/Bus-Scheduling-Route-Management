import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { Dialog } from '@headlessui/react'; // For modal dialogs
import { useForm } from 'react-hook-form'; // For form handling

const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 7; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};




const EmployeeManagement = ({ darkMode, handleCardClick }) => {
  // State to manage employees, modals, current employee being edited
  const [drivers, setDrivers] = useState([]);
  const [conductors, setConductors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const watchRole = watch('role');



  const conductor = [
    {
      name: "Manoj Gupta",
      role: "Conductor",
      id: "EMP004",
      phone: "9871234560",
      license: "CL123456",
      status: "Active",
      password: "conductorPass1",
      actions: "Edit/Delete"
    },
    {
      name: "Arjun Singh",
      role: "Conductor",
      id: "EMP005",
      phone: "9812345678",
      license: "CL234567",
      status: "Inactive",
      password: "conductorPass2",
      actions: "Edit/Delete"
    },
    {
      name: "Vikas Mehta",
      role: "Conductor",
      id: "EMP006",
      phone: "9823456712",
      license: "CL345678",
      status: "Active",
      password: "conductorPass3",
      actions: "Edit/Delete"
    },
    {
      name: "Sanjay Reddy",
      role: "Conductor",
      id: "EMP010",
      phone: "9712345670",
      license: "CL456789",
      status: "Active",
      password: "conductorPass4",
      actions: "Edit/Delete"
    },
    {
      name: "Rajiv Agarwal",
      role: "Conductor",
      id: "EMP011",
      phone: "9783456789",
      license: "CL567890",
      status: "Inactive",
      password: "conductorPass5",
      actions: "Edit/Delete"
    },
    {
      name: "Ravi Bhat",
      role: "Conductor",
      id: "EMP012",
      phone: "9826789345",
      license: "CL678901",
      status: "Active",
      password: "conductorPass6",
      actions: "Edit/Delete"
    }
  ];

  const driver = [
    {
      name: "Rajesh Sharma",
      role: "Driver",
      id: "EMP001",
      phone: "9876543210",
      license: "DL123456",
      status: "Active",
      password: "driverPass1",
      actions: "Edit/Delete"
    },
    {
      name: "Suresh Verma",
      role: "Driver",
      id: "EMP002",
      phone: "9123456789",
      license: "DL234567",
      status: "Inactive",
      password: "driverPass2",
      actions: "Edit/Delete"
    },
    {
      name: "Anil Kumar",
      role: "Driver",
      id: "EMP003",
      phone: "9988776655",
      license: "DL345678",
      status: "Active",
      password: "driverPass3",
      actions: "Edit/Delete"
    },
    {
      name: "Amit Singh",
      role: "Driver",
      id: "EMP007",
      phone: "9345678901",
      license: "DL456789",
      status: "Active",
      password: "driverPass4",
      actions: "Edit/Delete"
    },
    {
      name: "Deepak Patel",
      role: "Driver",
      id: "EMP008",
      phone: "9712345678",
      license: "DL567890",
      status: "Inactive",
      password: "driverPass5",
      actions: "Edit/Delete"
    },
    {
      name: "Nikhil Joshi",
      role: "Driver",
      id: "EMP009",
      phone: "9623456789",
      license: "DL678901",
      status: "Active",
      password: "driverPass6",
      actions: "Edit/Delete"
    },
  ];

  

  // Open modal for registering or editing
  const openModal = (employee = null) => {
    setCurrentEmployee(employee);
    setIsEditMode(!!employee);
    setIsModalOpen(true);
    // Set role and other fields if employee exists
    if (employee) {
      setValue('name', employee.name);
      setValue('role', employee.role);
      setValue('phone', employee.phone);
      setValue('license', employee.license || ''); // Ensure license field is set correctly
      setValue('status', employee.status);
    } else {
      reset();
    }
  };

  // Close modal and reset form
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
    reset();
  };

  // Handle form submission for adding or editing
  const onSubmit = (data) => {
    const employee = {
      ...data,
      id: Date.now(),
      password: generatePassword(), // Generate password
      status: 'Active', // Default status
    };

    if (data.role === 'driver') {
      // Add to driver list
      setDrivers((prevDrivers) => [...prevDrivers, employee]);
    } else if (data.role === 'conductor') {
      // Add to conductor list
      setConductors((prevConductors) => [...prevConductors, employee]);
    }
    closeModal();
  };

  // Handle employee deletion
  const deleteEmployee = (id, role) => {
    if (role === 'driver') {
      setDrivers((prevDrivers) => prevDrivers.filter((emp) => emp.id !== id));
    } else if (role === 'conductor') {
      setConductors((prevConductors) => prevConductors.filter((emp) => emp.id !== id));
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} w-full min-h-screen p-6 transition-all`}>
      {/* Back Button with gap from navbar */}
      <div className="mb-8 ">
        <button
          className={`px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-700 hover:bg-gray-100 hover:text-black'} text-white rounded flex items-center transition`}
          onClick={() => handleCardClick('overview')}
        >
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">Employee Management</h1>

      <button
        className={`mb-4 px-4 py-2 flex items-center ${darkMode ? 'bg-blue-800 hover:bg-blue-900' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded transition`}
        onClick={() => openModal()}
      >
        <FaPlus className="mr-2" /> Register Employee
      </button>

      {/* Driver List */}
      <h2 className="text-xl font-bold mt-6 mb-2">Drivers</h2>
      <table className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full border-collapse shadow-lg rounded-lg mb-6`}>
        <thead>
          <tr className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}>
            <th className="p-4 text-center">Name</th>
            <th className="p-4 text-center">Role</th>
            <th className="p-4 text-center">ID</th>
            <th className="p-4 text-center">Phone</th>
            <th className="p-4 text-center">License</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Password</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {driver.map((emp) => (
            <tr key={emp.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition`}>
              <td className="p-4 text-center">{emp.name}</td>
              <td className="p-4 text-center">{emp.role}</td>
              <td className="p-4 text-center">{emp.id}</td>
              <td className="p-4 text-center">{emp.phone}</td>
              <td className="p-4 text-center">{emp.license}</td>
              <td className="p-4 text-center">{emp.status}</td>
              <td className="p-4 text-center">{emp.password}</td>
              <td className="p-4 text-center flex justify-center space-x-2">
                <button className="text-blue-700 hover:text-blue-900 transition" onClick={() => openModal(emp)}>
                  <FaEdit />
                </button>
                <button className="text-red-700 hover:text-red-900 transition" onClick={() => deleteEmployee(emp.id, 'driver')}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Conductor List */}
      <h2 className="text-xl font-bold mt-6 mb-2">Conductors</h2>
      <table className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full border-collapse shadow-lg rounded-lg`}>
        <thead>
          <tr className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}>
            <th className="p-4 text-center">Name</th>
            <th className="p-4 text-center">Role</th>
            <th className="p-4 text-center">ID</th>
            <th className="p-4 text-center">Phone</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Password</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {conductor.map((emp) => (
            <tr key={emp.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition`}>
              <td className="p-4 text-center">{emp.name}</td>
              <td className="p-4 text-center">{emp.role}</td>
              <td className="p-4 text-center">{emp.id}</td>
              <td className="p-4 text-center">{emp.phone}</td>
              <td className="p-4 text-center">{emp.status}</td>
              <td className="p-4 text-center">{emp.password}</td>
              <td className="p-4 text-center flex justify-center space-x-2">
                <button className="text-blue-700 hover:text-blue-900 transition" onClick={() => openModal(emp)}>
                  <FaEdit />
                </button>
                <button className="text-red-700 hover:text-red-900 transition" onClick={() => deleteEmployee(emp.id, 'conductor')}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for registering/editing employee */}
      <Dialog open={isModalOpen} onClose={closeModal} className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} p-8 rounded-lg w-full max-w-md`}>
          <Dialog.Title className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Employee' : 'Register Employee'}</Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                {...register('name', { required: true })}
                className={`p-2 border rounded ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                {...register('role', { required: true })}
                onChange={(e) => setValue('role', e.target.value)} // Set value when role changes
                className={`p-2 border rounded ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
              >
                <option value="">Select a role</option>
                <option value="driver">Driver</option>
                <option value="conductor">Conductor</option>
              </select>
            </div>
            {watchRole === 'driver' && (
              <>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="license">License:</label>
                  <input
                    id="license"
                    type="text"
                    {...register('license')}
                    className={`p-2 border rounded ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </>
            )}
            {watchRole && (
              <>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="phone">Phone:</label>
                  <input
                    id="phone"
                    type="text"
                    {...register('phone', { required: true })}
                    className={`p-2 border rounded ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    {...register('status', { required: true })}
                    className={`p-2 border rounded ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </>
            )}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeModal}
                className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-300 hover:bg-gray-400'} text-white transition`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-800 hover:bg-blue-900' : 'bg-blue-600 hover:bg-blue-700'} text-white transition`}
              >
                {isEditMode ? 'Update' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
