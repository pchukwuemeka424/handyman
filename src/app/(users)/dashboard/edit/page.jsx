import React from 'react';

import Userdashboard from '@/components/userdashboard';
import Topbar from '@/components/topbar';

export default function AddProduct() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 h-screen">
      <Userdashboard />
    
      {/* Main Content Area */}
      <div className="col-span-4 p-6 bg-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {/* Topbar */}
        <Topbar />

        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
          <form>
            {/* Product Name */}
            <div className="mb-4">
              <label htmlFor="productName" className="block text-sm font-semibold text-gray-700">Product Name</label>
              <input
                type="text"
                id="productName"
                placeholder="Enter product name"
                className="w-full px-4 py-2 border rounded-lg mt-2"
                required
              />
            </div>

            {/* Product Amount */}
            <div className="mb-4">
              <label htmlFor="productAmount" className="block text-sm font-semibold text-gray-700">Product Amount</label>
              <input
                type="number"
                id="productAmount"
                placeholder="Enter product amount"
                className="w-full px-4 py-2 border rounded-lg mt-2"
                required
              />
            </div>

            {/* Product Category */}
            <div className="mb-4">
              <label htmlFor="productCategory" className="block text-sm font-semibold text-gray-700">Product Category</label>
              <select
                id="productCategory"
                className="w-full px-4 py-2 border rounded-lg mt-2"
                required
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Kitchen</option>
                <option value="toys">Toys</option>
                {/* Add more categories as needed */}
              </select>
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">Stock Status</label>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="stockStatus"
                    value="inStock"
                    className="mr-2"
                  />
                  In Stock
                </label>
                <label>
                  <input
                    type="radio"
                    name="stockStatus"
                    value="outOfStock"
                    className="mr-2"
                  />
                  Out of Stock
                </label>
              </div>
            </div>

            {/* Product Image */}
            <div className="mb-4">
              <label htmlFor="productImage" className="block text-sm font-semibold text-gray-700">Product Image</label>
              <input
                type="file"
                id="productImage"
                accept="image/*"
                className="w-full px-4 py-2 border rounded-lg mt-2"
              />
              {/* Preview would be shown here if JavaScript was enabled */}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg w-26"
            >
              Edit Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
