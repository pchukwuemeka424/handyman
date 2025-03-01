import React from 'react';
import { FaBell, FaUserAlt } from 'react-icons/fa'; // Importing icons
import Link from 'next/link';
import Userdashboard from '@/components/userdashboard';

export default function Topbar() {
  return (
    <div className="col-span-full bg-white shadow-md p-4">

      <div className="flex justify-between items-center space-x-4 mt-4">
      {/* <Userdashboard /> */}
     
        {/* <Link href="/dashboard/profile">
          <button className="flex items-center bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition duration-300">
            <FaUserAlt className="mr-2" />
            Profile
          </button>
        </Link> */}
      </div>
    </div>
  );
}
