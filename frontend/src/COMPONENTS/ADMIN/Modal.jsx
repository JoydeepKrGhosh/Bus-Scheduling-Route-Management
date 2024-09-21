import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

function Modal({ isEditing, bus, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    busNumber: '',
    capacity: '',
    status: 'available',
  });

  // Populate the form with the bus data when editing
  useEffect(() => {
    if (isEditing && bus) {
      setFormData({
        busNumber: bus.busNumber,
        capacity: bus.capacity,
        status: bus.status,
      });
    }
  }, [isEditing, bus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.busNumber || !formData.capacity) {
      alert('Please fill in all the fields');
      return;
    }

    try {
      if (isEditing) {
        // Edit existing bus (PUT Request)
        const response = await axios.put(`https://bus-scheduling-route-management-1.onrender.com/bus/${bus.id}`, formData);
        console.log('Bus updated successfully:', response.data);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Bus updated successfully!',
          showConfirmButton: false,
          timer: 1500, // Auto-close after 1.5 seconds
        });
      } else {
        // Add new bus (POST Request)
        const response = await axios.post('https://bus-scheduling-route-management-1.onrender.com/api/buses/add', formData);
        console.log('New bus added successfully:', response.data);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Bus added successfully!',
          showConfirmButton: false,
          timer: 1500, // Auto-close after 1.5 seconds
        });
      }

      onSubmit(formData); // Pass form data to parent
    } catch (error) {
      console.error('Error adding/editing bus:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was an issue with the bus submission. Please try again.',
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 dark:text-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? 'Edit Bus' : 'Add New Bus'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Bus Number</label>
            <input
              type="text"
              name="busNumber"
              value={formData.busNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700"
              placeholder="Enter Bus Number"
              required
              disabled={isEditing} // Bus number is not editable when editing
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700"
              placeholder="Enter Capacity"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700"
              required
            >
              <option value="available">Available</option>
              <option value="not available">Not Available</option>
              <option value="en route">En Route</option>
              <option value="at bus stand">At Bus Stand</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditing ? 'Save Changes' : 'Add Bus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;
