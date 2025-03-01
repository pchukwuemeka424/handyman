import React from 'react'

export default function loading() {
  return (
    <main>
    {/* Skeleton for Product Image */}
    <div className="lg:w-1/2 w-full mb-4">
      <div className="bg-gray-300 w-full h-64 rounded-lg animate-pulse"></div>
    </div>

    {/* Skeleton for Product Details */}
    <div className="lg:w-1/2">
      <div className="bg-gray-300 h-8 w-3/4 mb-4 animate-pulse"></div>
      <div className="bg-gray-300 h-4 w-full mb-4 animate-pulse"></div>
      <div className="bg-gray-300 h-8 w-1/2 mb-4 animate-pulse"></div>

      <div className="space-y-2 mb-4">
        <div className="bg-gray-300 h-4 w-full animate-pulse"></div>
        <div className="bg-gray-300 h-4 w-full animate-pulse"></div>
        <div className="bg-gray-300 h-4 w-1/2 animate-pulse"></div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-4">
        <div className="bg-gray-300 h-10 w-32 rounded-md animate-pulse"></div>
        <div className="bg-gray-300 h-10 w-32 rounded-md animate-pulse"></div>
        <div className="bg-gray-300 h-10 w-32 rounded-md animate-pulse"></div>
      </div>
    </div>
  </main>
  )
}
