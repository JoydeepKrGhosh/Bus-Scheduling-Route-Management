import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { Dialog } from '@headlessui/react'; // For modal dialogs
import { useForm } from 'react-hook-form'; // For form handling

const EmployeeManagement = ({ darkMode, handleCardClick }) => {
  // State to manage employees, modals, current employee being edited
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // Open modal for adding or editing
  const openModal = (employee = null) => {
    setCurrentEmployee(employee);
    setIsEditMode(!!employee);
    setIsModalOpen(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
    reset();
  };

  // Handle form submission for adding or editing
  const onSubmit = (data) => {
    if (isEditMode) {
      // Edit employee
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === currentEmployee.id ? { ...emp, ...data } : emp
        )
      );
    } else {
      // Add new employee
      setEmployees((prevEmployees) => [
        ...prevEmployees,
        { ...data, id: Date.now() }, // Generate unique ID
      ]);
    }
    closeModal();
  };

  // Handle employee deletion
  const deleteEmployee = (id) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((emp) => emp.id !== id)
    );
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} w-full min-h-screen p-6 transition-all`}>
      {/* Back Button with gap from navbar */}
      <div className="mb-8 mt-12"> {/* Added considerable margin to create a gap */}
        <button
          className={`px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-300 hover:bg-gray-400'} text-white rounded flex items-center transition`}
          onClick={() => handleCardClick('overview')} // Call the handleCardClick passed as prop
        >
          <FaArrowLeft className="mr-2" /> Back to Cards
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">Employee Management</h1>

      <button
        className={`mb-4 px-4 py-2 flex items-center ${darkMode ? 'bg-blue-800 hover:bg-blue-900' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded transition`}
        onClick={() => openModal()}
      >
        <FaPlus className="mr-2" /> Add New Employee
      </button>

      <table className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full border-collapse shadow-lg rounded-lg`}>
        <thead>
          <tr className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}>
            <th className="p-4 text-center">Name</th>
            <th className="p-4 text-center">Role</th>
            <th className="p-4 text-center">ID</th>
            <th className="p-4 text-center">Contact</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition`}>
              <td className="p-4 text-center">{emp.name}</td>
              <td className="p-4 text-center">{emp.role}</td>
              <td className="p-4 text-center">{emp.id}</td>
              <td className="p-4 text-center">{emp.contact}</td>
              <td className="p-4 text-center flex justify-center space-x-2">
                <button
                  className="text-blue-700 hover:text-blue-900 transition"
                  onClick={() => openModal(emp)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-700 hover:text-red-900 transition"
                  onClick={() => deleteEmployee(emp.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for adding/editing employee */}
      <Dialog open={isModalOpen} onClose={closeModal} className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} p-8 rounded-lg shadow-lg w-full max-w-md`}>
          <Dialog.Title className="text-xl font-bold mb-4 text-center">
            {isEditMode ? 'Edit Employee' : 'Add New Employee'}
          </Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                defaultValue={currentEmployee?.name || ''}
                {...register('name', { required: true })}
                className={`w-full p-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'} border rounded`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Role</label>
              <input
                type="text"
                defaultValue={currentEmployee?.role || ''}
                {...register('role', { required: true })}
                className={`w-full p-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'} border rounded`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Contact</label>
              <input
                type="text"
                defaultValue={currentEmployee?.contact || ''}
                {...register('contact', { required: true })}
                className={`w-full p-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'} border rounded`}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className={`px-4 py-2 mr-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} text-white rounded transition`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 ${darkMode ? 'bg-blue-800 hover:bg-blue-900' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded transition`}
              >
                {isEditMode ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
