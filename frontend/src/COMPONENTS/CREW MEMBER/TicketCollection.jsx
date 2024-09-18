import React, { useState } from 'react';

function TicketCollection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [busNumber, setBusNumber] = useState('');
  const [ticketsCollected, setTicketsCollected] = useState('');

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSave = () => {
    console.log(`Bus Number: ${busNumber}, Tickets Collected: ${ticketsCollected}`);
    setIsDialogOpen(false); // Close dialog after saving
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        onClick={handleOpenDialog}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Collect Tickets
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Ticket Collection</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Bus Number</label>
              <input
                type="text"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter bus number"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tickets Collected</label>
              <input
                type="number"
                value={ticketsCollected}
                onChange={(e) => setTicketsCollected(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter number of tickets collected"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseDialog}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketCollection;
