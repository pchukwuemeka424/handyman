import Link from 'next/link';
import React from 'react';
import { FaShopLock } from 'react-icons/fa6';

const ProductNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center transform transition duration-300 hover:scale-105">
        <div className="flex justify-center items-center bg-gray-200 p-4 rounded-full mb-4">
          <FaShopLock className="text-gray-600" size={64} />
        </div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn’t find the product you’re looking for. Try searching again or browse other categories.</p>
        <Link href="/" className="text-blue-600 hover:underline">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">Go Back</button>
        </Link>
      </div>
    </div>
  );
};

export default ProductNotFound;