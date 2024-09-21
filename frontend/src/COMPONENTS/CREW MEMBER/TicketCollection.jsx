import React, { useState, useEffect } from 'react';

function TicketCollection({ isOpen, onClose, onSubmit, busId }) {
  const [ticketsCollected, setTicketsCollected] = useState('');

  // Reset the input fields when the modal is reopened
  useEffect(() => {
    if (isOpen) {
      setTicketsCollected('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate ticket input
    if (!ticketsCollected) {
      alert("Please enter the number of tickets collected.");
      return;
    }

    // Prepare ticket data
    const ticketData = {
      busId,
      ticketsCollected: parseInt(ticketsCollected),
    };

    // Submit the form and close the modal
    onSubmit(ticketData);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 rounded-xl shadow-lg w-11/12 sm:w-96 transform transition-all duration-300 ease-out scale-100">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          Ticket Collection
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
              Bus ID:
            </label>
            <input
              type="text"
              value={busId}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
              Tickets Collected:
            </label>
            <input
              type="number"
              value={ticketsCollected}
              onChange={(e) => setTicketsCollected(e.target.value)}
              placeholder="Enter number of tickets"
              className="w-full px-4 py-3 text-black border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="submit"
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
            >
              Submit
            </button>
            <button
              type="button"
              className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TicketCollection;
