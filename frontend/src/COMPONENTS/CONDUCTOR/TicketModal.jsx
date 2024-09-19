// TicketModal.js
import React, { useState } from 'react';

const TicketModal = ({ isOpen, onClose, onSubmit }) => {
  const [busId, setBusId] = useState('');
  const [ticketsCollected, setTicketsCollected] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (busId && ticketsCollected) {
      // Pass the data to the parent component
      onSubmit({ busId, ticketsCollected });
      // Clear the inputs
      setBusId('');
      setTicketsCollected('');
      // Close the modal
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Enter Ticket Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="busId" className="block text-gray-700 mb-2">Bus ID:</label>
            <input
              type="text"
              id="busId"
              value={busId}
              onChange={(e) => setBusId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter Bus ID"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="ticketsCollected" className="block text-gray-700 mb-2">Tickets Collected:</label>
            <input
              type="number"
              id="ticketsCollected"
              value={ticketsCollected}
              onChange={(e) => setTicketsCollected(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter Tickets Collected"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketModal;
