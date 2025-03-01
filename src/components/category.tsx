"use client";
import React from 'react';
import { nigeriaStates } from './states';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { redirect } from 'next/navigation';
import { FaTv, FaTshirt, FaHome, FaDumbbell, FaPaw, FaGem, FaBaby, FaGamepad, FaHeart } from 'react-icons/fa';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function ProductCategories() {
//select from category

const supabase = createClient();
const [categorys, setcategorys] = useState([]);

useEffect(()=>{

  const fetchCategories = async () => {
    const { data: categories, error } = await supabase
    .from("category")
    .select("*");
    if (error) console.error("Error fetching categories:", error);
    else setcategorys(categories);
  };

  fetchCategories();

},[])

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); 
    const formData = new FormData(event.target);
    const search = formData.get('search');
    const state = formData.get('state');

    // Perform search logic here
    redirect(`/filter/?q=${search}&state=${state}`);
  };

  return (
    <div className="hidden sm:block col-span-3 bg-white p-4 rounded shadow">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Product
          </label>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Enter product name"
            className="w-full px-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* State Dropdown */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <Select name="state">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {nigeriaStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-rose-500 text-white p-2 px-4 rounded"
          >
            Search
          </button>
        </div>
      </form>
      {/* Product Categories */}
      <h2 className="text-lg font-bold mb-4">Product Categories</h2>

      <ul className="space-y-2 my-3 border-b shadow">
        {categorys.map((category) => (
          <li key={category.id}>
            <Link href={`/products/${category.id}`} className="flex items-center py-2 px-4 hover:bg-gray-100">
              <FaGem className="mr-2 text-rose-700" />
              {category.title}
            </Link>
          </li>
        ))}


      </ul>
    </div>
  );
}
