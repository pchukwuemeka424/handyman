'use client';

import React from 'react';
import CategoryList from '@/components/category';
import ProductFetch from './productFetch';
import Slider from '@/components/slider';

export default function Page() {
  return (
    <div className="space-y-4 overflow-hidden">
      {/* Full-width Slider */}
     

      {/* Responsive Grid */}
      <div className="grid grid-cols-1   sm:grid-cols-12">
        {/* Sidebar for product categories */}
        <div className="sm:col-span-12 lg:col-span-3">
          <CategoryList />
        </div>

        {/* Product list */}
        <div className="m-0 sm:col-span-12 lg:col-span-9">
           <div>
        <Slider />
      </div>
          <ProductFetch />
        </div>
      </div>
    </div>
  );
}
 