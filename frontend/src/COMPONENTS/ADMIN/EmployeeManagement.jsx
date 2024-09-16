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
      <div className="mb-8 mt-12">
        <button
          className={`px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-300 hover:bg-gray-400'} text-white rounded flex items-center transition`}
          onClick={() => handleCardClick('overview')}
        >
          <FaArrowLeft className="mr-2" /> Back to Cards
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
          {drivers.map((emp) => (
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
          {conductors.map((emp) => (
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
