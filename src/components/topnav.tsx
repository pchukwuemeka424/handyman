"use client";
import React from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { nigeriaStates } from "./states";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Topnav() {
  return (
    <div>
      <div className="flex justify-between items-center px-4 py-2">
        <Image
          src="https://fbpdbcxjavianaboavoo.supabase.co/storage/v1/object/public/images//default-image-icon-missing-picture-page-vector-40546530.jpg"
          alt="Logo"
          width={100}
          height={100}
          className="h-16 w-36 sm:h-16 sm:w-36 "
        />

        <Button>Login</Button>
      </div>
      <div className="w-full sm:flex sm:justify-end items-center px-4">
       
        <div>
          <form className=" w-full mx-auto">
            <div className="flex items-center ">
              {/* Search Input */}

              <input
                type="text"
                name="search"
                placeholder="Search"
                className="p-2 h-12 border border-gray-300 w-full sm:w-72 rounded-l-md focus:outline-none"
              />

              {/* Location Dropdown */}
              <div className="relative w-full sm:w-48">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <select
                  name="state"
                  className="w-full pl-10 pr-4 py-2 h-12 border border-gray-300 text-gray-700 focus:outline-none"
                >
                  <option value="">Location</option>
                  {nigeriaStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button className="bg-blue-500 text-white px-4 h-12 rounded-r-md flex items-center justify-center">
                <FaSearch />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
