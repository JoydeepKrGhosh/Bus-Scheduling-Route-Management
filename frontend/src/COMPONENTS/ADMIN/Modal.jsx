import React, { useState, useEffect } from 'react';

function Modal({ isEditing, bus, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    id: '',
    type: '',
    currentRoute: '',
    capacity: '',
    status: 'Available',
  });

  // Populate the form with the bus data when editing
  useEffect(() => {
    if (isEditing && bus) {
      setFormData({
        id: bus.id,
        type: bus.type,
        currentRoute: bus.currentRoute,
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform validation if needed (e.g., ensuring all fields are filled)
    if (!formData.id || !formData.type || !formData.currentRoute || !formData.capacity) {
      alert('Please fill in all the fields');
      return;
    }

    // Pass the form data to the parent component for processing
    onSubmit(formData);
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
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700"
              placeholder="Enter Bus ID"
              required
              disabled={isEditing} // Bus ID is not editable when editing
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Bus Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700"
              required
            >
              <option value="">Select Bus Type</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Current Route</label>
            <input
              type="text"
              name="currentRoute"
              value={formData.currentRoute}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700"
              placeholder="Enter Route"
              required
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
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
              <option value="En Route">En Route</option>
              <option value="At Bus Stand">At Bus Stand</option>
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
