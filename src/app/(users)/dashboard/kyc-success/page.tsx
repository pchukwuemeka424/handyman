"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function KYCSuccess() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">KYC Submission Successful!</h1>
        <p className="text-gray-700 mb-6">
          Your KYC information has been submitted successfully. We will review your details and get back to you within 24-48 hours.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
