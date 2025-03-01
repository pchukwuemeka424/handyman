import React from 'react';
import { FaUsers, FaUpload, FaUserClock, FaExclamationCircle } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
          <div className="text-blue-600">
            <FaUsers size={32} />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Total Users</h3>
            <p className="text-lg text-gray-500">1,200</p>
          </div>
        </div>

        {/* Total Unverified Users */}
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
          <div className="text-yellow-500">
            <FaUserClock size={32} />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Total Unverified Users</h3>
            <p className="text-lg text-gray-500">450</p>
          </div>
        </div>

        {/* Total Uploads */}
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
          <div className="text-green-600">
            <FaUpload size={32} />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Total Uploads</h3>
            <p className="text-lg text-gray-500">3,700</p>
          </div>
        </div>

        {/* More Cards */}
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
          <div className="text-red-600">
            <FaExclamationCircle size={32} />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Critical Alerts</h3>
            <p className="text-lg text-gray-500">2</p>
          </div>
        </div>
        
        {/* Add more stats/cards as needed */}
      </div>
    </div>
  );
};

export default AdminDashboard;
