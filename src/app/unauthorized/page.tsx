"use client";
import React from 'react';
import { Lock } from 'lucide-react'; // React Icon for a lock

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <Lock className="text-red-500 w-12 h-12" />
        </div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          You do not have permission to view this page. Please contact your administrator or go back to the previous page.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
