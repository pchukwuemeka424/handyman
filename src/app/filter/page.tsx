'use client';

import React from 'react';
import CategoryList from '@/components/category';
import SearchProduct from './filterFetch';

export default function Page() {

  return (
    <div>
   
      <div className="grid grid-cols-12 gap-4 px-4">


        {/* Product list */}
        <SearchProduct />
      </div>
    </div>
  );
}
