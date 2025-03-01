"use client";

import { useEffect, useState } from 'react';

export default function Banner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    visible && (
      <div
        className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-cover bg-center w-full h-48 rounded-lg text-center z-10"
        style={{
          backgroundImage: "url('https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/products_image/public/1736747767059-mk.jpg')",
        }}
      >
        <div className="flex flex-col justify-center items-center w-full h-full bg-black bg-opacity-50 rounded-lg text-white">
          <p className="text-lg md:text-2xl">Your text here</p>
        </div>
      </div>
    )
  );
}
