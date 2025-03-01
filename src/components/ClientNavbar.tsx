'use client'; // Add this at the very top

import React from 'react';
import Link from 'next/link';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { createClient } from '@/utils/supabase-db'; 
import { useRouter } from 'next/navigation'; // For client-side navigation

// Define the type for authUser
type ClientNavbarProps = {
  authUser: { id: string | null } | null; // Ensure that authUser can be null
};

const ClientNavbar: React.FC<ClientNavbarProps> = ({ authUser }) => {
  const router = useRouter(); // Hook to navigate after logout

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      router.push('/'); // Using next/router for navigation
    }
  };

  return (
    <div>
      {authUser ? (
        <div className="flex space-x-6">
          <Link href="/users/dashboard" className="text-white hover:text-gray-300 transition">Dashboard</Link>
          <Link href="/product" className="text-white hover:text-gray-300 transition">Stores</Link>
          <Link href="/" className="text-white hover:text-gray-300 transition">Products</Link>
          <button onClick={handleLogout} className="text-white hover:text-gray-300 transition" aria-label="Logout">
            Logout
          </button>
        </div>
      ) : (
        <div className="flex space-x-2 ml-6">
          <Link href="/product" className="text-white hover:text-gray-300 transition">
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" aria-label="Products">
              <FaSignInAlt className="mr-2" /> Products
            </button>
          </Link>
          <Link href="/login" className="text-white hover:text-gray-300 transition">
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" aria-label="Login">
              <FaSignInAlt className="mr-2" /> Login
            </button>
          </Link>
          <Link href="/register" className="text-white hover:text-gray-300 transition">
            <button className="flex items-center px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition" aria-label="Register">
              <FaUserPlus className="mr-2" /> Register
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ClientNavbar;
