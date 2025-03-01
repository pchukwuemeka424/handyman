"use client";
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header({ shopDetails, totalProducts }) {
  return (
    <header className="sticky top-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl h-20 mx-auto flex items-center justify-between p-4">
        {/* Logo and Name */}
        <div className="flex items-center space-x-3">
          <Image src={shopDetails.avater} alt="Logo" className="w-20 h-20" width={100} height={100} />
          <h1 className="text-2xl font-bold text-gray-800">{shopDetails.shopname}</h1>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href={`/store/${shopDetails.username}`} className="text-gray-700 hover:text-blue-600 transition font-medium">Home</Link>
         
          <Link href={`/store/contact/${shopDetails.username}`} className="text-gray-700 hover:text-blue-600 transition font-medium">Contact Us</Link>
        </div>

        {/* Mobile Menu (Home Icon + Products and Contact Us) */}
        <div className="md:hidden flex items-center space-x-4">
          <Link href={`/store/${shopDetails.username}`} className="text-gray-700 hover:text-blue-600 transition font-medium">
            <FaHome className="w-6 h-6" />
          </Link>
     
          <Link href={`/store/contact/${shopDetails.username}`} className="text-gray-700 hover:text-blue-600 transition font-medium">
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}
