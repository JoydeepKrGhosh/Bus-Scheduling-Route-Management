import React, { useState } from 'react';

const FilterComponent = ({ onFilter }) => {
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [scheduleType, setScheduleType] = useState('');

  const handleFilter = () => {
    // Trigger the filtering logic in parent
    onFilter({
      searchText,
      status,
      date,
      scheduleType,
    });
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-lg border border-gray-300">
      {/* Search Bar */}
      <div className="flex-grow">
        <input
          type="text"
          placeholder="Search anything..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Status */}
      <div className="w-1/6">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">Select Status</option>
          <option value="On Time">Scheduled</option>
          <option value="Delayed">On-going</option>
          <option value="Cancelled">Completed</option>
        </select>
      </div>

      {/* Date */}
      <div className="w-1/6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Schedule Type */}
      <div className="w-1/6">
        <select
          value={scheduleType}
          onChange={(e) => setScheduleType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">Select Schedule</option>
          <option value="All">All</option>
          <option value="Previous Schedule">Previous Schedule</option>
          <option value="Current Schedule">Current Schedule</option>
        </select>
      </div>

      {/* Filter Button */}
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition focus:outline-none"
        onClick={handleFilter}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterComponent;
