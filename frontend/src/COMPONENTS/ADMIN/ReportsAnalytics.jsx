import React, { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FaArrowLeft } from 'react-icons/fa'; // Back icon

ChartJS.register(...registerables);

const ReportsAnalytics = ({ darkMode, handleCardClick }) => {
  const [expandedChart, setExpandedChart] = useState(null);

  // Sample data for charts
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Bus Utilization',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: '#4c51bf',
        backgroundColor: 'rgba(76, 81, 191, 0.2)',
      },
    ],
  };

  // Export to PDF functionality (Placeholder)
  const exportToPDF = () => {
    alert('Exporting to PDF...'); // Add actual PDF export functionality here
  };

  // Export to Excel functionality
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Metric: 'Bus Utilization', January: 65, February: 59, March: 80, April: 81, May: 56, June: 55 },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'reports.xlsx');
  };

  // Render different types of charts
  const renderChart = (type) => {
    switch (type) {
      case 'line':
        return <Line data={data} />;
      case 'bar':
        return <Bar data={data} />;
      case 'doughnut':
        return <Doughnut data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className={`w-full h-full p-6 mt-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Top Back button */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => handleCardClick('overview')} // Ensure this navigates to the previous view
          className={`text-lg font-bold flex items-center ${darkMode ? 'text-white' : 'text-black'}`}
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Reports & Analytics</h2>

      {/* Chart grid layout */}
      <div className={`grid ${expandedChart ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4 mb-4`}>
        <div
          className={`p-4 shadow-lg rounded-lg cursor-pointer ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          onClick={() => setExpandedChart('line')}
        >
          <h3 className="text-lg font-semibold mb-2">Bus Utilization</h3>
          {!expandedChart || expandedChart === 'line' ? <Line data={data} /> : null}
        </div>

        <div
          className={`p-4 shadow-lg rounded-lg cursor-pointer ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          onClick={() => setExpandedChart('bar')}
        >
          <h3 className="text-lg font-semibold mb-2">Route Efficiency</h3>
          {!expandedChart || expandedChart === 'bar' ? <Bar data={data} /> : null}
        </div>

        <div
          className={`p-4 shadow-lg rounded-lg cursor-pointer ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          onClick={() => setExpandedChart('doughnut')}
        >
          <h3 className="text-lg font-semibold mb-2">Employee Activity</h3>
          {!expandedChart || expandedChart === 'doughnut' ? <Doughnut data={data} /> : null}
        </div>
      </div>

      {expandedChart && (
        <div className="p-6 mb-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">
            Expanded View - {expandedChart.charAt(0).toUpperCase() + expandedChart.slice(1)} Chart
          </h3>
          <div className="h-96">{renderChart(expandedChart)}</div>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          className={`px-4 py-2 rounded-md mr-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-blue-600 text-white'}`}
          onClick={exportToPDF}
        >
          Export to PDF
        </button>
        <button
          className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-green-600 text-white'}`}
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
