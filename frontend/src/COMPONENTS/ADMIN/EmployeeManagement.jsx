import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';

const EmployeeManagement = ({ darkMode, handleCardClick }) => {
  const [drivers, setDrivers] = useState([]);
  const [conductors, setConductors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const watchRole = watch('role');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const driversResponse = await fetch('http://localhost:5000/api/drivers/alldrivers');
        const conductorsResponse = await fetch('http://localhost:5000/api/conductors/allconductor');

        const driversData = await driversResponse.json();
        const conductorsData = await conductorsResponse.json();

        setDrivers(driversData);
        setConductors(conductorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEmployees();
  }, []);

  const openModal = (employee = null) => {
    setCurrentEmployee(employee);
    setIsEditMode(!!employee);
    setIsModalOpen(true);
    if (employee) {
      setValue('name', employee.name);
      setValue('employeeCode', employee.employeeCode);
      setValue('phone', employee.phone);
      setValue('status', employee.status);
      setValue('password', employee.password || '');
      setValue('license', employee.license || '');
    } else {
      reset();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
    reset();
  };

  const onSubmit = async (data) => {
    const employeeData = {
      name: data.name,
      employeeCode: data.employeeCode,
      phone_number: data.phone,
      password: data.password,
      status: data.status,
    };

    if (data.role === 'driver') {
      employeeData.license_number = data.license;
    }

    const apiUrl = data.role === 'driver'
      ? 'http://localhost:5000/api/drivers/register'
      : 'http://localhost:5000/api/conductors/register';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        if (data.role === 'driver') {
          setDrivers((prevDrivers) => [...prevDrivers, employeeData]);
        } else if (data.role === 'conductor') {
          setConductors((prevConductors) => [...prevConductors, employeeData]);
        }
      } else {
        console.error("Failed to register employee");
      }
    } catch (error) {
      console.error("Error registering employee:", error);
    }

    closeModal();
  };

  const deleteEmployee = (id, role) => {
    if (role === 'driver') {
      setDrivers((prevDrivers) => prevDrivers.filter((emp) => emp.id !== id));
    } else if (role === 'conductor') {
      setConductors((prevConductors) => prevConductors.filter((emp) => emp.id !== id));
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} w-full min-h-screen p-6 transition-all`}>
      <div className="mb-8">
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
            <th className="p-4 text-center">Employee Code</th>
            <th className="p-4 text-center">Phone</th>
            <th className="p-4 text-center">License</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((emp) => (
            <tr key={emp.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition`}>
              <td className="p-4 text-center">{emp.name}</td>
              <td className="p-4 text-center">{emp.employeeCode}</td>
              <td className="p-4 text-center">{emp.phone_number}</td>
              <td className="p-4 text-center">{emp.license_number}</td>
              <td className="p-4 text-center text-lg font-bold text-green-600">Active</td>
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
            <th className="p-4 text-center">Employee Code</th>
            <th className="p-4 text-center">Phone</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {conductors.map((emp) => (
            <tr key={emp.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition`}>
              <td className="p-4 text-center">{emp.name}</td>
              <td className="p-4 text-center">{emp.employeeCode}</td>
              <td className="p-4 text-center">{emp.phone_number}</td>
              <td className="p-4 text-center text-lg font-bold text-green-600">Active</td>
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
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                {...register('name', { required: true })}
              />
            </div>

            <div>
              <label className="block font-medium">Employee Code</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                {...register('employeeCode', { required: true })}
              />
            </div>

            <div>
              <label className="block font-medium">Phone</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                {...register('phone', { required: true })}
              />
            </div>

            <div>
              <label className="block font-medium">Status</label>
              <select className="w-full p-2 border rounded" {...register('status', { required: true })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Role</label>
              <select className="w-full p-2 border rounded" {...register('role', { required: true })}>
                <option value="conductor">Conductor</option>
                <option value="driver">Driver</option>
              </select>
            </div>

            {/* License number for Drivers only */}
            {watchRole === 'driver' && (
              <div>
                <label className="block font-medium">License Number</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  {...register('license', { required: watchRole === 'driver' })}
                />
              </div>
            )}

            {/* Password field for both roles */}
            <div>
              <label className="block font-medium">Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                {...register('password', { required: true })}
              />
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
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

