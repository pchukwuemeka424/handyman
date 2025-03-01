import Link from 'next/link';
import React from 'react';
import { FaUserAlt, FaStore, FaSignInAlt } from 'react-icons/fa'; // Importing icons

export default function AgentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full">
        {/* Register Agent Section */}
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center transform transition duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-gray-800">
            <FaUserAlt className="inline-block mr-2 text-blue-600" /> Register as an Agent
          </h2>
          <p className="text-gray-600 mt-4">Join our platform and start offering your services today.</p>
          <Link href="/agent/register">
          
              <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 shadow-md">
                Register Now
              </button>
          
          </Link>
        </div>

        {/* Register Vendor Section */}
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center transform transition duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-gray-800">
            <FaStore className="inline-block mr-2 text-purple-600" /> Register a Vendor
          </h2>
          <p className="text-gray-600 mt-4">Start selling your products on our platform today.</p>
          <Link href="/agent/addVendor">
          
              <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300 shadow-md">
                Register Now
              </button>
          
          </Link>
        </div>

        {/* Login Section */}
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center transform transition duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-gray-800">
            <FaSignInAlt className="inline-block mr-2 text-green-600" /> Agent Login
          </h2>
          <p className="text-gray-600 mt-4">Access your dashboard and manage your services efficiently.</p>
          <Link href="/agent/login">
          
              <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition duration-300 shadow-md">
                Login
              </button>
          
          </Link>
        </div>
      </div>
    </div>
  );
}
